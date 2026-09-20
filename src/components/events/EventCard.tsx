import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { EventStatusBadge } from '@/components/events/EventStatusBadge';
import { formatDateTime, formatEventDate, formatEventTime } from '@/utils/eventFormat';
import type { Event } from '@/types/domain';

export function EventCard({ event }: { event: Event }) {
  return (
    <Link className="block focus:outline-none focus:ring-2 focus:ring-violet-500" to={`/app/events/${event.id}`}>
      <Card className="transition hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-semibold">{event.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{formatEventDate(event.eventDate)}</p>
          </div>
          <EventStatusBadge status={event.status} />
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Time</dt>
            <dd className="font-medium">{formatEventTime(event)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Participants</dt>
            <dd className="font-medium">{event.participantCount}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Outfits</dt>
            <dd className="font-medium">{event.outfitCount}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Venue</dt>
            <dd className="truncate font-medium">{event.location || 'Not set'}</dd>
          </div>
        </dl>

        <p className="mt-5 text-xs text-slate-500">Updated {formatDateTime(event.updatedAt)}</p>
      </Card>
    </Link>
  );
}
