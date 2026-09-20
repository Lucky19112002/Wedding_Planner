import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { EventForm } from '@/components/events';
import { ErrorState } from '@/components/ui/ErrorState';
import { usePermission } from '@/hooks/usePermission';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { useEventStore } from '@/store/eventStore';
import type { EventInput } from '@/types/domain';

export function EventCreatePage() {
  const navigate = useNavigate();
  const { activeWeddingId } = useWeddingContext();
  const canCreate = usePermission('events', 'create');
  const createEvent = useEventStore((state) => state.createEvent);
  const error = useEventStore((state) => state.error);
  const saving = useEventStore((state) => state.saving);

  async function handleSubmit(input: EventInput) {
    const event = await createEvent(input);
    navigate(`/app/events/${event.id}`);
  }

  if (!canCreate) return <ErrorState message="Creating events is only available to admins." />;
  if (!activeWeddingId) return <ErrorState message="Choose a wedding before creating events." />;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to="/app/events">
        Back to events
      </Link>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">New Event</h1>
        <p className="mt-2 text-sm text-slate-600">Add a wedding event with schedule, venue, notes, and status.</p>
      </div>
      {error ? <ErrorState message={error} /> : null}
      <Card>
        <EventForm
          isSaving={saving}
          submitLabel="Create Event"
          weddingId={activeWeddingId}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
