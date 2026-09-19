import { Link } from 'react-router-dom';
import { EventStatusBadge } from '@/components/events/EventStatusBadge';
import { Card } from '@/components/ui/Card';
import type { DashboardTimelineEvent } from '@/types/domain';
import { formatDaysRemaining } from '@/utils/dashboardMetrics';
import { formatEventDate } from '@/utils/eventFormat';

export function UpcomingTimeline({ events }: { events: DashboardTimelineEvent[] }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Upcoming timeline</h2>
      <div className="mt-4 space-y-3">
        {events.length === 0 ? <p className="text-sm text-slate-600">No upcoming events scheduled.</p> : null}
        {events.map((event) => (
          <Link
            key={event.eventId}
            className="block rounded-md border border-slate-200 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
            to={`/app/events/${event.eventId}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{event.name}</p>
                <p className="mt-1 text-sm text-slate-600">{formatEventDate(event.eventDate)}</p>
                <p className="mt-1 text-sm text-slate-500">{event.location ?? 'Venue not set'}</p>
              </div>
              <div className="text-right">
                <p className={event.daysRemaining === 0 ? 'font-semibold text-rose-600' : 'font-semibold text-slate-900'}>
                  {formatDaysRemaining(event.daysRemaining)}
                </p>
                <div className="mt-2">
                  <EventStatusBadge status={event.status} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
