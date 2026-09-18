import { supabase } from '@/lib/supabase';
import type { ShoppingLink, ShoppingLinkInput } from '@/types/domain';

const maxLinks = 5;

type ShoppingLinkRow = {
  id: string;
  outfit_id: string;
  wedding_id: string;
  url: string;
  label: string | null;
  sort_order: number;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

const linkSelect = 'id,outfit_id,wedding_id,url,label,sort_order,archived_at,created_at,updated_at';

function mapLink(row: ShoppingLinkRow): ShoppingLink {
  return {
    id: row.id,
    outfitId: row.outfit_id,
    weddingId: row.wedding_id,
    url: row.url,
    label: row.label,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

function normalizeUrl(url: string) {
  const parsed = new URL(url.trim());
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Use a valid http or https link.');
  return parsed.toString();
}

export async function getShoppingLinks(outfitId: string): Promise<ShoppingLink[]> {
  const { data, error } = await supabase
    .from('outfit_urls')
    .select(linkSelect)
    .eq('outfit_id', outfitId)
    .is('archived_at', null)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return ((data ?? []) as ShoppingLinkRow[]).map(mapLink);
}

export async function createShoppingLink(input: ShoppingLinkInput, existingCount: number): Promise<ShoppingLink> {
  if (existingCount >= maxLinks) throw new Error('An outfit can have up to 5 shopping links.');
  const { data, error } = await supabase
    .from('outfit_urls')
    .insert({
      outfit_id: input.outfitId,
      wedding_id: input.weddingId,
      url: normalizeUrl(input.url),
      label: input.label?.trim() || null,
      sort_order: existingCount + 1,
    })
    .select(linkSelect)
    .single<ShoppingLinkRow>();

  if (error) throw error;
  return mapLink(data);
}

export async function updateShoppingLink(linkId: string, input: ShoppingLinkInput): Promise<ShoppingLink> {
  const { data, error } = await supabase
    .from('outfit_urls')
    .update({
      url: normalizeUrl(input.url),
      label: input.label?.trim() || null,
    })
    .eq('id', linkId)
    .is('archived_at', null)
    .select(linkSelect)
    .single<ShoppingLinkRow>();

  if (error) throw error;
  return mapLink(data);
}

export async function deleteShoppingLink(linkId: string): Promise<void> {
  const { error } = await supabase.from('outfit_urls').delete().eq('id', linkId);
  if (error) throw error;
}
