import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { EventForm } from '@/components/events';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { useEventStore } from '@/store/eventStore';
import type { EventInput } from '@/types/domain';

export function EventEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { activeWeddingId } = useWeddingContext();
  const event = useEventStore((state) => state.selectedEvent);
  const error = useEventStore((state) => state.error);
  const loading = useEventStore((state) => state.loading);
  const saving = useEventStore((state) => state.saving);
  const loadEvent = useEventStore((state) => state.loadEvent);
  const updateEvent = useEventStore((state) => state.updateEvent);

  useEffect(() => {
    if (id) void loadEvent(id);
  }, [id, loadEvent]);

  async function handleSubmit(input: EventInput) {
    if (!id) return;
    await updateEvent(id, input);
    navigate(`/app/events/${id}`);
  }

  if (loading && !event) return <Loader label="Loading event" />;
  if (error) return <ErrorState message={error} />;
  if (!event || !activeWeddingId) return <ErrorState message="Event not found." />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to={`/app/events/${event.id}`}>
        Back to event
      </Link>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Edit Event</h1>
        <p className="mt-2 text-sm text-slate-600">Update schedule, venue, notes, and status.</p>
      </div>
      <Card>
        <EventForm
          event={event}
          isSaving={saving}
          submitLabel="Save Changes"
          weddingId={activeWeddingId}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
