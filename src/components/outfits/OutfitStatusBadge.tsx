import { Badge } from '@/components/ui/Badge';
import { outfitStatusLabels } from '@/utils/outfitWorkflow';
import type { OutfitStatus } from '@/types/domain';

const badgeClass: Record<OutfitStatus, string> = {
  idea: 'bg-slate-100 text-slate-700',
  shortlisted: 'bg-violet-50 text-violet-700',
  ordered: 'bg-amber-50 text-amber-700',
  received: 'bg-sky-50 text-sky-700',
  altered: 'bg-fuchsia-50 text-fuchsia-700',
  ready: 'bg-emerald-50 text-emerald-700',
  dropped: 'bg-rose-50 text-rose-700',
};

export function OutfitStatusBadge({ status }: { status: OutfitStatus }) {
  return <Badge className={badgeClass[status]}>{outfitStatusLabels[status]}</Badge>;
}
