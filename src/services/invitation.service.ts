import { supabase } from '@/lib/supabase';
import type {
  Invitation,
  InvitationInput,
  InvitationStatus,
  Profile,
  SentInvitation,
  WeddingRole,
} from '@/types/domain';
import { buildAppUrl } from '@/utils/appUrl';

type InvitationRow = {
  id: string;
  wedding_id: string;
  email: string;
  invited_role: WeddingRole;
  status: InvitationStatus;
  expires_at: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

type WeddingRow = {
  id: string;
  name: string;
};

type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  is_super_admin: boolean;
  is_deactivated: boolean;
  relationship_note: string | null;
};

type RpcId = string;

function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string') {
      if (message.includes('uq_invitations_pending_email')) {
        return 'A pending invitation already exists for this email and wedding.';
      }
      return message;
    }
  }
  return error instanceof Error ? error.message : 'Invitation request failed.';
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    isSuperAdmin: row.is_super_admin,
    isDeactivated: row.is_deactivated,
    relationshipNote: row.relationship_note,
  };
}

function buildInviteUrl(token: string): string {
  return buildAppUrl(`/invite/${encodeURIComponent(token)}`);
}

async function hashInviteToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function generateInviteToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function mapInvitation(
  row: InvitationRow,
  weddings: Map<string, WeddingRow>,
  inviters: Map<string, ProfileRow>,
): Invitation {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    weddingName: weddings.get(row.wedding_id)?.name ?? null,
    email: row.email,
    invitedRole: row.invited_role,
    status: row.status,
    expiresAt: row.expires_at,
    invitedBy: row.created_by ? inviters.get(row.created_by)?.display_name ?? null : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getProfilesByIds(ids: string[]): Promise<Map<string, ProfileRow>> {
  if (ids.length === 0) return new Map();
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,display_name,is_super_admin,is_deactivated,relationship_note')
    .in('id', ids);

  if (error) throw error;
  return new Map(((data ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));
}

async function getWeddingsByIds(ids: string[]): Promise<Map<string, WeddingRow>> {
  if (ids.length === 0) return new Map();
  const { data, error } = await supabase.from('weddings').select('id,name').in('id', ids);
  if (error) throw error;
  return new Map(((data ?? []) as WeddingRow[]).map((wedding) => [wedding.id, wedding]));
}

async function getProfileByEmail(email: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,display_name,is_super_admin,is_deactivated,relationship_note')
    .ilike('email', email)
    .maybeSingle<ProfileRow>();

  if (error) throw error;
  return data ? mapProfile(data) : null;
}

async function isActiveWeddingMember(weddingId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('wedding_memberships')
    .select('id')
    .eq('wedding_id', weddingId)
    .eq('user_id', userId)
    .is('archived_at', null)
    .maybeSingle<{ id: string }>();

  if (error) throw error;
  return Boolean(data);
}

export async function getPendingInvitations(weddingId: string): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from('invitations')
    .select('id,wedding_id,email,invited_role,status,expires_at,created_at,updated_at,created_by')
    .eq('wedding_id', weddingId)
    .is('archived_at', null)
    .in('status', ['pending', 'expired'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as InvitationRow[];
  const [weddings, inviters] = await Promise.all([
    getWeddingsByIds([...new Set(rows.map((row) => row.wedding_id))]),
    getProfilesByIds([...new Set(rows.flatMap((row) => (row.created_by ? [row.created_by] : [])))]),
  ]);

  return rows.map((row) => mapInvitation(row, weddings, inviters));
}

export async function sendInvitation(input: InvitationInput): Promise<SentInvitation> {
  const email = input.email.trim().toLowerCase();
  const existingUser = await getProfileByEmail(email);
  if (existingUser && (await isActiveWeddingMember(input.weddingId, existingUser.id))) {
    throw new Error('This user already belongs to the selected wedding.');
  }
  const token = generateInviteToken();
  const { data: invitationId, error } = await supabase.rpc('create_invitation', {
    p_wedding_id: input.weddingId,
    p_email: email,
    p_role: input.invitedRole,
    p_token: token,
  });

  if (error) {
    throw new Error(getErrorMessage(error));
  }

  const invitations = await getPendingInvitations(input.weddingId);
  const invitation = invitations.find((item) => item.id === (invitationId as RpcId));
  if (!invitation) throw new Error('Invitation was sent, but the pending invite could not be reloaded.');

  return { invitation, inviteUrl: buildInviteUrl(token), existingUser };
}

export async function resendInvitation(invitationId: string, weddingId: string): Promise<string> {
  const token = generateInviteToken();
  const { error } = await supabase.rpc('resend_invitation', {
    p_invitation_id: invitationId,
    p_new_token: token,
  });

  if (error) throw new Error(getErrorMessage(error));
  await getPendingInvitations(weddingId);
  return buildInviteUrl(token);
}

export async function cancelInvitation(invitationId: string): Promise<void> {
  const { error } = await supabase.rpc('cancel_invitation', { p_invitation_id: invitationId });
  if (error) throw new Error(getErrorMessage(error));
}

export async function acceptInvitation(token: string): Promise<void> {
  const { error } = await supabase.rpc('accept_invitation', { p_token: token });
  if (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getInvitationState(
  token: string,
): Promise<'valid' | 'expired' | 'accepted' | 'cancelled' | 'rejected' | 'invalid'> {
  const { data, error } = await supabase
    .from('invitations')
    .select('status,expires_at')
    .eq('token_hash', await hashInviteToken(token))
    .maybeSingle<{ status: InvitationStatus; expires_at: string }>();

  if (error) throw new Error(getErrorMessage(error));
  if (!data) return 'invalid';
  if (data.status === 'pending' && new Date(data.expires_at).getTime() < Date.now()) return 'expired';
  if (data.status === 'pending') return 'valid';
  return data.status;
}

export async function rejectInvitation(token: string): Promise<void> {
  const { error } = await supabase.rpc('reject_invitation', { p_token: token });
  if (error) throw new Error(getErrorMessage(error));
}
