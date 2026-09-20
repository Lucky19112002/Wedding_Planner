import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { Select } from '@/components/ui/Select';
import { OutfitImagePlaceholder, OutfitStatusBadge } from '@/components/outfits';
import { getEvents } from '@/services/event.service';
import { getWeddingOutfits } from '@/services/outfit.service';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { formatEventDate } from '@/utils/eventFormat';
import { formatOutfitSummary, formatOutfitTitle } from '@/utils/outfitFormat';
import type { Event, Outfit } from '@/types/domain';

type EventWithOutfits = Event & { outfits: Outfit[] };

function personFilterId(outfit: Outfit) {
  return outfit.ownerUserId ?? outfit.participantId;
}

export function ClothingPage() {
  const { activeWeddingId } = useWeddingContext();
  const [events, setEvents] = useState<Event[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [eventFilter, setEventFilter] = useState('all');
  const [personFilters, setPersonFilters] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeWeddingId) return;

    void Promise.all([getEvents(activeWeddingId), getWeddingOutfits(activeWeddingId)])
      .then(([nextEvents, nextOutfits]) => {
        setEvents(nextEvents);
        setOutfits(nextOutfits);
        setError(null);
      })
      .catch((nextError: unknown) => {
        setError(nextError instanceof Error ? nextError.message : 'Clothing could not be loaded.');
      })
      .finally(() => setLoading(false));
  }, [activeWeddingId]);

  const people = useMemo(
    () =>
      [...new Map(outfits.map((outfit) => [personFilterId(outfit), outfit.participantName ?? 'Former user'])).entries()]
        .map(([id, name]) => ({ id, name }))
        .sort((left, right) => left.name.localeCompare(right.name)),
    [outfits],
  );

  const groups = useMemo<EventWithOutfits[]>(() => {
    const query = search.trim().toLowerCase();
    const selectedPeople = new Set(personFilters);
    return events
      .filter((event) => eventFilter === 'all' || event.id === eventFilter)
      .map((event) => ({
        ...event,
        outfits: outfits.filter((outfit) => {
          if (outfit.eventId !== event.id) return false;
          if (selectedPeople.size > 0 && !selectedPeople.has(personFilterId(outfit))) return false;
          if (!query) return true;
          return [event.name, outfit.participantName, outfit.participantEmail, outfit.dressType, outfit.colour, outfit.status].some(
            (value) => value?.toLowerCase().includes(query),
          );
        }),
      }))
      .filter((event) => event.outfits.length > 0 || !query);
  }, [eventFilter, events, outfits, personFilters, search]);

  if (loading) return <Loader label="Loading clothing" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section>
        <p className="text-sm font-medium text-brand-700">Clothing</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Event clothing</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          View outfits for the events assigned to you. Editing stays limited by your event permission.
        </p>
      </section>

      <Card className="grid gap-3 md:grid-cols-[1fr_220px_220px]">
        <Input
          aria-label="Search clothing"
          placeholder="Search clothing, colour, status, or event"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select aria-label="Filter by event" value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}>
          <option value="all">All assigned events</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by person"
          multiple
          value={personFilters}
          onChange={(event) =>
            setPersonFilters([...event.target.selectedOptions].map((option) => option.value))
          }
        >
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>
      </Card>

      {groups.length === 0 ? (
        <EmptyState title="No clothing found" description="Try a different search or event filter." />
      ) : (
        groups.map((event) => (
          <section key={event.id} className="space-y-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">{event.name}</h2>
                <p className="text-sm text-slate-500">{formatEventDate(event.eventDate)} - {event.outfits.length} outfits</p>
              </div>
              <Link className="text-sm font-medium text-brand-700" to={`/app/events/${event.id}`}>
                Open event
              </Link>
            </div>

            {event.outfits.length === 0 ? (
              <Card className="text-sm text-slate-600">No clothing planned for this event yet.</Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {event.outfits.map((outfit) => (
                  <Link key={outfit.id} to={`/app/outfits/${outfit.id}`}>
                    <Card className="h-full space-y-3 transition hover:-translate-y-0.5 hover:shadow-md">
                      <OutfitImagePlaceholder outfit={outfit} />
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{formatOutfitTitle(outfit)}</h3>
                          <p className="text-sm text-slate-600">{formatOutfitSummary(outfit)}</p>
                          <p className="mt-1 text-xs font-medium text-slate-500">For {outfit.participantName ?? 'Former user'}</p>
                        </div>
                        <OutfitStatusBadge status={outfit.status} />
                      </div>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <dt className="text-slate-500">Images</dt>
                          <dd className="font-medium">{outfit.imageCount}</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Links</dt>
                          <dd className="font-medium">{outfit.shoppingLinkCount}</dd>
                        </div>
                      </dl>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))
      )}
    </div>
  );
}
