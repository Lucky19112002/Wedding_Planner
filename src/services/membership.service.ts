import { supabase } from '@/lib/supabase';
import type { Membership, WeddingRole } from '@/types/domain';

type MembershipRow = {
  id: string;
  wedding_id: string;
  user_id: string;
  role: WeddingRole;
};

function mapMembership(row: MembershipRow): Membership {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    userId: row.user_id,
    role: row.role,
  };
}

export async function listMemberships(userId: string): Promise<Membership[]> {
  const { data, error } = await supabase
    .from('wedding_memberships')
    .select('id,wedding_id,user_id,role')
    .eq('user_id', userId)
    .is('archived_at', null);

  if (error) throw error;
  return (data ?? []).map((row) => mapMembership(row as MembershipRow));
}
