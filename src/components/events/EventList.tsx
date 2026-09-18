import { EventCard } from '@/components/events/EventCard';
import type { Event } from '@/types/domain';

export function EventList({ events }: { events: Event[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  );
}
