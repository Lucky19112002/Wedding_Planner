import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { Select } from '@/components/ui/Select';
import { EventEmptyState, EventList } from '@/components/events';
import { usePermission } from '@/hooks/usePermission';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { useEventStore } from '@/store/eventStore';
import { eventStatuses, eventStatusLabels } from '@/utils/eventWorkflow';
import type { Event, EventStatus } from '@/types/domain';

function eventTime(event: Event) {
  return event.eventDate ? new Date(`${event.eventDate}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
}

function sortEventsByPlanningOrder(events: Event[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  return [...events].sort((left, right) => {
    const leftTime = eventTime(left);
    const rightTime = eventTime(right);
    const leftPast = leftTime < todayTime;
    const rightPast = rightTime < todayTime;
    if (leftPast !== rightPast) return leftPast ? 1 : -1;
    return leftTime - rightTime || left.name.localeCompare(right.name);
  });
}

export function EventsPage() {
  const { activeWeddingId } = useWeddingContext();
  const canCreate = usePermission('events', 'create');
  const events = useEventStore((state) => state.events);
  const error = useEventStore((state) => state.error);
  const loading = useEventStore((state) => state.loading);
  const loadEvents = useEventStore((state) => state.loadEvents);
  const search = useEventStore((state) => state.search);
  const setSearch = useEventStore((state) => state.setSearch);
  const statusFilter = useEventStore((state) => state.statusFilter);
  const setStatusFilter = useEventStore((state) => state.setStatusFilter);

  useEffect(() => {
    if (activeWeddingId) void loadEvents(activeWeddingId);
  }, [activeWeddingId, loadEvents]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sortEventsByPlanningOrder(events.filter((event) => {
      const matchesSearch =
        !query ||
        event.name.toLowerCase().includes(query) ||
        (event.location?.toLowerCase().includes(query) ?? false);
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      return matchesSearch && matchesStatus;
    }));
  }, [events, search, statusFilter]);
  const hasFilters = Boolean(search.trim()) || statusFilter !== 'all';

  if (loading && events.length === 0) return <Loader label="Loading events" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Event Management</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Events</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            View the events assigned to you. Admins can manage the full wedding timeline.
          </p>
        </div>
        {canCreate ? (
          <div className="hidden md:block">
            <Button asChild>
              <Link to="/app/events/new">New Event</Link>
            </Button>
          </div>
        ) : null}
      </section>

      <Card className="grid gap-3 md:grid-cols-[1fr_220px]">
        <Input
          aria-label="Search events"
          placeholder="Search by name or venue"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as EventStatus | 'all')}
        >
          <option value="all">All statuses</option>
          {eventStatuses.map((status) => (
            <option key={status} value={status}>
              {eventStatusLabels[status]}
            </option>
          ))}
        </Select>
      </Card>

      {filteredEvents.length === 0 ? (
        <EventEmptyState hasFilters={hasFilters} />
      ) : (
        <EventList events={filteredEvents} />
      )}

      {canCreate ? (
        <Button asChild className="fixed bottom-5 right-5 z-20 rounded-full px-5 shadow-lg md:hidden">
          <Link to="/app/events/new">New Event</Link>
        </Button>
      ) : null}
    </div>
  );
}
