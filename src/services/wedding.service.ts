import { supabase } from '@/lib/supabase';
import type { Wedding } from '@/types/domain';

type WeddingRow = {
  id: string;
  name: string;
  couple_names: string | null;
  wedding_date: string | null;
  notes: string | null;
};

function mapWedding(row: WeddingRow): Wedding {
  return {
    id: row.id,
    name: row.name,
    coupleNames: row.couple_names,
    weddingDate: row.wedding_date,
    notes: row.notes,
  };
}

export async function listAccessibleWeddings(): Promise<Wedding[]> {
  const { data, error } = await supabase
    .from('weddings')
    .select('id,name,couple_names,wedding_date,notes')
    .is('archived_at', null)
    .order('wedding_date', { ascending: true, nullsFirst: false })
    .order('name');

  if (error) throw error;
  return (data ?? []).map((row) => mapWedding(row as WeddingRow));
}
