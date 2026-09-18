import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/domain';

type ProfileRow = {
  id: string;
  email: string;
  display_name: string;
  is_super_admin: boolean;
  is_deactivated: boolean;
  relationship_note: string | null;
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

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id,email,display_name,is_super_admin,is_deactivated,relationship_note')
    .eq('id', userId)
    .maybeSingle<ProfileRow>();

  if (error) throw error;
  return data ? mapProfile(data) : null;
}
