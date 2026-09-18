import { Badge } from '@/components/ui/Badge';
import type { WeddingRole } from '@/types/domain';

const labels: Record<WeddingRole, string> = {
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

export function ParticipantRoleBadge({ role }: { role: WeddingRole | null }) {
  return <Badge className="bg-slate-100 text-slate-700">{role ? labels[role] : 'No membership'}</Badge>;
}
