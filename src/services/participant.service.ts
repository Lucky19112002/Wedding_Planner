import { supabase } from '@/lib/supabase';
import type {
  Participant,
  ParticipantCandidate,
  ParticipantInput,
  ParticipantUpdateInput,
  WeddingRole,
} from '@/types/domain';

type ParticipantRow = {
  id: string;
  event_id: string;
  wedding_id: string;
  user_id: string | null;
  role_in_event: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  relationship_note: string | null;
};

type MembershipRow = {
  user_id: string;
  role: WeddingRole;
};

type OutfitRow = {
  participant_id: string;
};

function byId<T extends { id: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.id, row]));
}

function countOutfits(rows: OutfitRow[]): Map<string, number> {
  return rows.reduce((counts, row) => {
    counts.set(row.participant_id, (counts.get(row.participant_id) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
}

function mapParticipant(
  row: ParticipantRow,
  profile: ProfileRow | undefined,
  memberRole: WeddingRole | null,
  outfitCount: number,
): Participant {
  return {
    id: row.id,
    eventId: row.event_id,
    weddingId: row.wedding_id,
    userId: row.user_id,
    displayName: profile?.display_name ?? 'Former user',
    email: profile?.email ?? null,
    relationshipNote: profile?.relationship_note ?? null,
    roleInEvent: row.role_in_event,
    memberRole,
    outfitCount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

async function getProfiles(userIds: string[]): Promise<Map<string, ProfileRow>> {
  if (userIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,display_name,relationship_note')
    .in('id', userIds);

  if (error) throw error;
  return byId((data ?? []) as ProfileRow[]);
}

async function getMembershipRoles(weddingId: string, userIds?: string[]): Promise<Map<string, WeddingRole>> {
  let query = supabase
    .from('wedding_memberships')
    .select('user_id,role')
    .eq('wedding_id', weddingId)
    .is('archived_at', null);

  if (userIds && userIds.length > 0) query = query.in('user_id', userIds);

  const { data, error } = await query;
  if (error) throw error;

  return new Map(((data ?? []) as MembershipRow[]).map((row) => [row.user_id, row.role]));
}

async function getEventParticipantUserIds(eventId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('participants')
    .select('user_id')
    .eq('event_id', eventId)
    .not('user_id', 'is', null);

  if (error) throw error;
  return new Set(((data ?? []) as Array<{ user_id: string }>).map((row) => row.user_id));
}

export async function getParticipants(eventId: string, weddingId: string): Promise<Participant[]> {
  const { data, error } = await supabase
    .from('participants')
    .select('id,event_id,wedding_id,user_id,role_in_event,archived_at,created_at,updated_at')
    .eq('event_id', eventId)
    .is('archived_at', null)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as ParticipantRow[];
  const userIds = rows.flatMap((row) => (row.user_id ? [row.user_id] : []));
  const participantIds = rows.map((row) => row.id);

  const [{ data: outfitData, error: outfitError }, profiles, roles] = await Promise.all([
    participantIds.length > 0
      ? supabase
          .from('outfits')
          .select('participant_id')
          .in('participant_id', participantIds)
          .is('archived_at', null)
      : Promise.resolve({ data: [], error: null }),
    getProfiles(userIds),
    getMembershipRoles(weddingId, userIds),
  ]);

  if (outfitError) throw outfitError;
  const outfitCounts = countOutfits((outfitData ?? []) as OutfitRow[]);

  return rows.map((row) =>
    mapParticipant(
      row,
      row.user_id ? profiles.get(row.user_id) : undefined,
      row.user_id ? (roles.get(row.user_id) ?? null) : null,
      outfitCounts.get(row.id) ?? 0,
    ),
  );
}

export async function getParticipantCandidates(
  weddingId: string,
  eventId: string,
): Promise<ParticipantCandidate[]> {
  const { data: membershipData, error: membershipError } = await supabase
    .from('wedding_memberships')
    .select('user_id,role')
    .eq('wedding_id', weddingId)
    .is('archived_at', null);

  if (membershipError) throw membershipError;

  const memberships = (membershipData ?? []) as MembershipRow[];
  const userIds = memberships.map((membership) => membership.user_id);
  const [profiles, participantUserIds] = await Promise.all([
    getProfiles(userIds),
    getEventParticipantUserIds(eventId),
  ]);

  return memberships
    .map((membership) => {
      const profile = profiles.get(membership.user_id);
      if (!profile) return null;
      return {
        userId: membership.user_id,
        displayName: profile.display_name,
        email: profile.email,
        relationshipNote: profile.relationship_note,
        memberRole: membership.role,
        isAlreadyParticipant: participantUserIds.has(membership.user_id),
      };
    })
    .filter((candidate): candidate is ParticipantCandidate => candidate !== null)
    .sort((left, right) => left.displayName.localeCompare(right.displayName));
}

export async function addParticipant(input: ParticipantInput): Promise<Participant> {
  const roles = await getMembershipRoles(input.weddingId, [input.userId]);
  if (!roles.has(input.userId)) throw new Error('User must belong to this wedding.');

  const { data: duplicate, error: duplicateError } = await supabase
    .from('participants')
    .select('id,archived_at')
    .eq('event_id', input.eventId)
    .eq('user_id', input.userId)
    .maybeSingle<{ id: string; archived_at: string | null }>();

  if (duplicateError) throw duplicateError;
  if (duplicate) {
    throw new Error(
      duplicate.archived_at
        ? 'This member was removed earlier and cannot be added again without restore support.'
        : 'This member is already a participant.',
    );
  }

  const { data, error } = await supabase
    .from('participants')
    .insert({
      event_id: input.eventId,
      wedding_id: input.weddingId,
      user_id: input.userId,
      role_in_event: input.roleInEvent.trim() || null,
    })
    .select('id,event_id,wedding_id,user_id,role_in_event,archived_at,created_at,updated_at')
    .single<ParticipantRow>();

  if (error) throw error;

  const profiles = await getProfiles([input.userId]);
  return mapParticipant(data, profiles.get(input.userId), roles.get(input.userId) ?? null, 0);
}

export async function updateParticipant(
  participantId: string,
  input: ParticipantUpdateInput,
): Promise<Participant> {
  const { data: existing, error: existingError } = await supabase
    .from('participants')
    .select('id,event_id,wedding_id,user_id,role_in_event,archived_at,created_at,updated_at')
    .eq('id', participantId)
    .is('archived_at', null)
    .maybeSingle<ParticipantRow>();

  if (existingError) throw existingError;
  if (!existing) throw new Error('Archived participants cannot be edited.');

  const { data, error } = await supabase
    .from('participants')
    .update({ role_in_event: input.roleInEvent.trim() || null })
    .eq('id', participantId)
    .is('archived_at', null)
    .select('id,event_id,wedding_id,user_id,role_in_event,archived_at,created_at,updated_at')
    .single<ParticipantRow>();

  if (error) throw error;

  const userIds = data.user_id ? [data.user_id] : [];
  const [profiles, roles, participants] = await Promise.all([
    getProfiles(userIds),
    getMembershipRoles(data.wedding_id, userIds),
    getParticipants(data.event_id, data.wedding_id),
  ]);
  const current = participants.find((participant) => participant.id === data.id);

  return mapParticipant(
    data,
    data.user_id ? profiles.get(data.user_id) : undefined,
    data.user_id ? (roles.get(data.user_id) ?? null) : null,
    current?.outfitCount ?? 0,
  );
}

export async function archiveParticipant(participantId: string): Promise<void> {
  const { error } = await supabase.rpc('archive_participant', {
    p_participant_id: participantId,
    p_restore: false,
  });

  if (error) throw error;
}
