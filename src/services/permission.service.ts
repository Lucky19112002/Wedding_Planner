import { supabase } from '@/lib/supabase';
import type { InvitationStatus, ManagedUser, Profile, WeddingRole } from '@/types/domain';
import { isLastSuperAdmin } from '@/utils/permissions';

type MembershipRow = {
  id: string;
  user_id: string;
  role: WeddingRole;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  is_super_admin: boolean;
  is_deactivated: boolean;
  relationship_note: string | null;
};

type InvitationRow = {
  email: string;
  status: InvitationStatus;
};

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

function mapUser(
  membership: MembershipRow,
  profile: ProfileRow,
  invitations: Map<string, InvitationStatus>,
): ManagedUser {
  return {
    userId: profile.id,
    membershipId: membership.id,
    displayName: profile.display_name,
    email: profile.email,
    systemRole: profile.is_super_admin ? 'super_admin' : 'user',
    weddingRole: membership.role,
    invitationStatus: invitations.get(profile.email.toLowerCase()) ?? 'none',
    isDeactivated: profile.is_deactivated,
    relationshipNote: profile.relationship_note,
    updatedAt: membership.updated_at,
  };
}

async function getProfiles(userIds: string[]): Promise<ProfileRow[]> {
  if (userIds.length === 0) return [];
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,display_name,is_super_admin,is_deactivated,relationship_note')
    .in('id', userIds);

  if (error) throw error;
  return (data ?? []) as ProfileRow[];
}

async function getPendingInvitationStatuses(weddingId: string): Promise<Map<string, InvitationStatus>> {
  const { data, error } = await supabase
    .from('invitations')
    .select('email,status')
    .eq('wedding_id', weddingId)
    .is('archived_at', null)
    .in('status', ['pending', 'expired']);

  if (error) throw error;
  return new Map(((data ?? []) as InvitationRow[]).map((row) => [row.email.toLowerCase(), row.status]));
}

export async function getUsers(weddingId: string): Promise<ManagedUser[]> {
  const { data, error } = await supabase
    .from('wedding_memberships')
    .select('id,user_id,role,updated_at')
    .eq('wedding_id', weddingId)
    .is('archived_at', null)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const memberships = (data ?? []) as MembershipRow[];
  const [profiles, invitations] = await Promise.all([
    getProfiles(memberships.map((membership) => membership.user_id)),
    getPendingInvitationStatuses(weddingId),
  ]);
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));

  return memberships
    .flatMap((membership) => {
      const profile = profilesById.get(membership.user_id);
      return profile ? [mapUser(membership, profile, invitations)] : [];
    })
    .sort((a, b) => a.displayName.localeCompare(b.displayName));
}

export async function updateRole(membershipId: string, role: WeddingRole): Promise<void> {
  const { error } = await supabase
    .from('wedding_memberships')
    .update({ role })
    .eq('id', membershipId);

  if (error) throw error;
}

export async function updatePermissions(membershipId: string, role: WeddingRole): Promise<void> {
  await updateRole(membershipId, role);
}

export async function deactivateUser(userId: string): Promise<void> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,display_name,is_super_admin,is_deactivated,relationship_note')
    .eq('is_deactivated', false)
    .or(`id.eq.${userId},is_super_admin.eq.true`);

  if (error) throw error;

  const profiles = ((data ?? []) as ProfileRow[]).map(mapProfile);
  const target = profiles.find((profile) => profile.id === userId);
  if (!target) throw new Error('User could not be found.');
  if (isLastSuperAdmin(target, profiles)) {
    throw new Error('The last active Super Admin cannot be deactivated.');
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ is_deactivated: true })
    .eq('id', userId);

  if (updateError) throw updateError;
}
