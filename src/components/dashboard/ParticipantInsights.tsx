import { Avatar } from '@/components/ui/Avatar';
import { Card } from '@/components/ui/Card';
import type { DashboardParticipantInsight } from '@/types/domain';
import { clampProgress } from '@/utils/dashboardMetrics';

export function ParticipantInsights({ participants }: { participants: DashboardParticipantInsight[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Needs attention</h2>
      <div className="mt-4 space-y-3">
        {participants.length === 0 ? <p className="text-sm text-slate-600">No participants yet.</p> : null}
        {participants.map((participant) => {
          const progress = clampProgress(participant.progressPct);
          return (
            <div key={participant.participantId} className="rounded-md border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <Avatar name={participant.displayName} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{participant.displayName}</p>
                  <p className="truncate text-sm text-slate-500">{participant.relationshipNote ?? participant.email}</p>
                </div>
                <span className="text-sm font-semibold">{progress}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-emerald-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-sm text-slate-600">
                {participant.readyOutfits} ready · {participant.pendingOutfits} pending
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
