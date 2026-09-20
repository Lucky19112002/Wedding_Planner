import { supabase } from '@/lib/supabase';
import type { Outfit, OutfitInput, OutfitStatus } from '@/types/domain';

type OutfitRow = {
  id: string;
  participant_id: string;
  event_id: string;
  wedding_id: string;
  owner_user_id: string | null;
  dress_type: string | null;
  colour: string | null;
  quantity: number;
  notes: string | null;
  status: OutfitStatus;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

type ParticipantRow = {
  id: string;
  event_id: string;
  wedding_id: string;
  user_id: string | null;
};

type OutfitParticipantRow = {
  id: string;
  user_id: string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
};

type ImageRow = {
  outfit_id: string;
  storage_path: string;
  sort_order: number;
};

type UrlRow = {
  outfit_id: string;
};

const outfitSelect =
  'id,participant_id,event_id,wedding_id,owner_user_id,dress_type,colour,quantity,notes,status,archived_at,created_at,updated_at';
const bucket = 'outfit-references';

function countByOutfit<T extends { outfit_id: string }>(rows: T[]): Map<string, number> {
  return rows.reduce((counts, row) => {
    counts.set(row.outfit_id, (counts.get(row.outfit_id) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
}

function mapPrimaryImages(rows: ImageRow[]): Map<string, string> {
  const sorted = [...rows].sort((left, right) => left.sort_order - right.sort_order);
  return sorted.reduce((images, row) => {
    if (!images.has(row.outfit_id)) images.set(row.outfit_id, row.storage_path);
    return images;
  }, new Map<string, string>());
}

async function mapPrimaryImageUrls(primaryImages: Map<string, string>): Promise<Map<string, string>> {
  const entries = await Promise.all(
    [...primaryImages.entries()].map(async ([outfitId, storagePath]) => {
      const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storagePath, 60 * 30);
      if (error) return [outfitId, ''] as const;
      return [outfitId, data.signedUrl] as const;
    }),
  );
  return new Map(entries.filter(([, url]) => url));
}

function mapOutfit(
  row: OutfitRow,
  primaryImages = new Map<string, string>(),
  primaryImageUrls = new Map<string, string>(),
  imageCounts = new Map<string, number>(),
  linkCounts = new Map<string, number>(),
  participantProfiles = new Map<string, ProfileRow>(),
): Outfit {
  const participantProfile = participantProfiles.get(row.participant_id);
  return {
    id: row.id,
    participantId: row.participant_id,
    participantName: participantProfile?.display_name,
    participantEmail: participantProfile?.email ?? null,
    eventId: row.event_id,
    weddingId: row.wedding_id,
    ownerUserId: row.owner_user_id,
    dressType: row.dress_type,
    colour: row.colour,
    quantity: row.quantity,
    notes: row.notes,
    status: row.status,
    primaryImagePath: primaryImages.get(row.id) ?? null,
    primaryImageUrl: primaryImageUrls.get(row.id) ?? null,
    imageCount: imageCounts.get(row.id) ?? 0,
    shoppingLinkCount: linkCounts.get(row.id) ?? 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}


async function getParticipantProfiles(participantIds: string[]): Promise<Map<string, ProfileRow>> {
  if (participantIds.length === 0) return new Map();

  const { data: participants, error: participantError } = await supabase
    .from('participants')
    .select('id,user_id')
    .in('id', participantIds)
    .is('archived_at', null);

  if (participantError) throw participantError;

  const rows = (participants ?? []) as OutfitParticipantRow[];
  const userIds = rows.flatMap((row) => (row.user_id ? [row.user_id] : []));
  if (userIds.length === 0) return new Map();

  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id,email,display_name')
    .in('id', userIds);

  if (profileError) throw profileError;

  const profilesById = new Map(((profiles ?? []) as ProfileRow[]).map((profile) => [profile.id, profile]));
  return new Map(rows.flatMap((row) => {
    const profile = row.user_id ? profilesById.get(row.user_id) : undefined;
    return profile ? [[row.id, profile] as const] : [];
  }));
}

async function getOutfitMeta(outfitIds: string[]) {
  if (outfitIds.length === 0) {
    return {
      primaryImages: new Map<string, string>(),
      imageCounts: new Map<string, number>(),
      linkCounts: new Map<string, number>(),
    };
  }

  const [{ data: imageData, error: imageError }, { data: urlData, error: urlError }] = await Promise.all([
    supabase
      .from('outfit_images')
      .select('outfit_id,storage_path,sort_order')
      .in('outfit_id', outfitIds)
      .is('archived_at', null),
    supabase.from('outfit_urls').select('outfit_id').in('outfit_id', outfitIds).is('archived_at', null),
  ]);

  if (imageError) throw imageError;
  if (urlError) throw urlError;

  const images = (imageData ?? []) as ImageRow[];
  const primaryImages = mapPrimaryImages(images);
  return {
    primaryImages,
    primaryImageUrls: await mapPrimaryImageUrls(primaryImages),
    imageCounts: countByOutfit(images),
    linkCounts: countByOutfit((urlData ?? []) as UrlRow[]),
  };
}

async function getParticipant(participantId: string): Promise<ParticipantRow> {
  const { data, error } = await supabase
    .from('participants')
    .select('id,event_id,wedding_id,user_id')
    .eq('id', participantId)
    .is('archived_at', null)
    .single<ParticipantRow>();

  if (error) throw error;
  return data;
}

function toRow(input: OutfitInput, participant: ParticipantRow) {
  return {
    participant_id: input.participantId,
    event_id: participant.event_id,
    wedding_id: participant.wedding_id,
    owner_user_id: participant.user_id,
    dress_type: input.dressType.trim(),
    colour: input.colour.trim(),
    quantity: input.quantity,
    notes: input.notes,
    status: input.status,
  };
}


export async function getWeddingOutfits(weddingId: string): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from('outfits')
    .select(outfitSelect)
    .eq('wedding_id', weddingId)
    .is('archived_at', null)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as OutfitRow[];
  const [meta, participantProfiles] = await Promise.all([
    getOutfitMeta(rows.map((row) => row.id)),
    getParticipantProfiles(rows.map((row) => row.participant_id)),
  ]);
  return rows.map((row) =>
    mapOutfit(row, meta.primaryImages, meta.primaryImageUrls, meta.imageCounts, meta.linkCounts, participantProfiles),
  );
}

export async function switchOutfitParticipant(outfitId: string, participantId: string): Promise<Outfit> {
  const { error } = await supabase.rpc('switch_outfit_participant', {
    p_outfit_id: outfitId,
    p_participant_id: participantId,
  });

  if (error) throw error;

  const outfit = await getOutfit(outfitId);
  if (!outfit) throw new Error('Outfit not found.');
  return outfit;
}

export async function getOutfits(participantId: string): Promise<Outfit[]> {
  const { data, error } = await supabase
    .from('outfits')
    .select(outfitSelect)
    .eq('participant_id', participantId)
    .is('archived_at', null)
    .order('updated_at', { ascending: false });

  if (error) throw error;

  const rows = (data ?? []) as OutfitRow[];
  const meta = await getOutfitMeta(rows.map((row) => row.id));
  return rows.map((row) => mapOutfit(row, meta.primaryImages, meta.primaryImageUrls, meta.imageCounts, meta.linkCounts));
}

export async function getOutfit(outfitId: string): Promise<Outfit | null> {
  const { data, error } = await supabase
    .from('outfits')
    .select(outfitSelect)
    .eq('id', outfitId)
    .is('archived_at', null)
    .maybeSingle<OutfitRow>();

  if (error) throw error;
  if (!data) return null;

  const [meta, participantProfiles] = await Promise.all([
    getOutfitMeta([data.id]),
    getParticipantProfiles([data.participant_id]),
  ]);
  return mapOutfit(data, meta.primaryImages, meta.primaryImageUrls, meta.imageCounts, meta.linkCounts, participantProfiles);
}

export async function createOutfit(input: OutfitInput): Promise<Outfit> {
  const participant = await getParticipant(input.participantId);
  const { data, error } = await supabase.from('outfits').insert(toRow(input, participant)).select(outfitSelect).single<OutfitRow>();

  if (error) throw error;
  return mapOutfit(data);
}

export async function updateOutfit(outfitId: string, input: OutfitInput): Promise<Outfit> {
  const participant = await getParticipant(input.participantId);
  const { data, error } = await supabase
    .from('outfits')
    .update(toRow(input, participant))
    .eq('id', outfitId)
    .is('archived_at', null)
    .select(outfitSelect)
    .single<OutfitRow>();

  if (error) throw error;

  const meta = await getOutfitMeta([data.id]);
  return mapOutfit(data, meta.primaryImages, meta.primaryImageUrls, meta.imageCounts, meta.linkCounts);
}

export async function archiveOutfit(outfitId: string): Promise<void> {
  const { error } = await supabase.rpc('archive_outfit', {
    p_outfit_id: outfitId,
    p_restore: false,
  });

  if (error) throw error;
}
