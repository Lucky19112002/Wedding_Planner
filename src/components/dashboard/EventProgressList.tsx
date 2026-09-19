import { Link } from 'react-router-dom';
import { EventStatusBadge } from '@/components/events/EventStatusBadge';
import { Card } from '@/components/ui/Card';
import type { DashboardEventProgress } from '@/types/domain';
import { formatEventDate } from '@/utils/eventFormat';
import { clampProgress } from '@/utils/dashboardMetrics';

export function EventProgressList({ events }: { events: DashboardEventProgress[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Event progress</h2>
      <div className="mt-4 space-y-3">
        {events.length === 0 ? <p className="text-sm text-slate-600">No events yet.</p> : null}
        {events.map((event) => {
          const progress = clampProgress(event.progressPct);
          return (
            <Link
              key={event.eventId}
              className="block rounded-md border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
              to={`/app/events/${event.eventId}`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold">{event.name}</h3>
                  <p className="mt-1 text-sm text-slate-600">{formatEventDate(event.eventDate)}</p>
                </div>
                <EventStatusBadge status={event.status} />
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                <span>{progress}% complete</span>
                <span>{event.readyOutfitCount} ready outfits</span>
                <span>{event.participantCount} participants</span>
              </div>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}
