import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EventStatusBadge } from '@/components/events/EventStatusBadge';
import { formatEventDate, formatEventTime } from '@/utils/eventFormat';
import type { Event } from '@/types/domain';

type EventHeaderProps = {
  event: Event;
  canEdit: boolean;
  canArchive: boolean;
  onArchive: () => void;
};

export function EventHeader({ canArchive, canEdit, event, onArchive }: EventHeaderProps) {
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <EventStatusBadge status={event.status} />
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">{event.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {formatEventDate(event.eventDate)} · {formatEventTime(event)}
          </p>
        </div>
        {canEdit || canArchive ? (
          <div className="flex gap-2">
            {canEdit ? (
              <Button asChild variant="secondary">
                <Link to={`/app/events/${event.id}/edit`}>Edit</Link>
              </Button>
            ) : null}
            {canArchive ? (
              <Button variant="ghost" onClick={onArchive}>
                Archive
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
