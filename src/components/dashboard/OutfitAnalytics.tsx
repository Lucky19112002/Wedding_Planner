import { Card } from '@/components/ui/Card';
import type { DashboardOutfitAnalytics, OutfitStatus } from '@/types/domain';
import { outfitStatusLabels, outfitStatuses } from '@/utils/outfitWorkflow';

const colorByStatus: Record<OutfitStatus, string> = {
  altered: 'bg-cyan-500',
  dropped: 'bg-slate-400',
  idea: 'bg-slate-300',
  ordered: 'bg-amber-500',
  ready: 'bg-emerald-500',
  received: 'bg-sky-500',
  shortlisted: 'bg-violet-500',
};

export function OutfitAnalytics({ analytics }: { analytics: DashboardOutfitAnalytics }) {
  const max = Math.max(1, ...outfitStatuses.map((status) => analytics[status]));

  return (
    <Card>
      <h2 className="text-lg font-semibold">Outfit analytics</h2>
      <div className="mt-4 space-y-3">
        {outfitStatuses.map((status) => (
          <div key={status}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{outfitStatusLabels[status]}</span>
              <span className="text-slate-600">{analytics[status]}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${colorByStatus[status]}`}
                style={{ width: `${(analytics[status] / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
