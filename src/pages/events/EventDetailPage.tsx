import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArchiveDialog, EventHeader, EventTimeline } from '@/components/events';
import { EventParticipantsSection } from '@/components/participants';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { getMyEventPermission } from '@/services/permission.service';
import { useEventStore } from '@/store/eventStore';
import { formatDateTime, formatEventDate, formatEventTime } from '@/utils/eventFormat';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [eventPermission, setEventPermission] = useState<'view' | 'edit' | null>(null);
  const event = useEventStore((state) => state.selectedEvent);
  const error = useEventStore((state) => state.error);
  const loading = useEventStore((state) => state.loading);
  const saving = useEventStore((state) => state.saving);
  const archiveEvent = useEventStore((state) => state.archiveEvent);
  const loadEvent = useEventStore((state) => state.loadEvent);
  const [isArchiveOpen, setArchiveOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    void loadEvent(id);
    void getMyEventPermission(id).then(setEventPermission).catch(() => setEventPermission(null));
  }, [id, loadEvent]);

  async function handleArchive() {
    if (!event) return;
    await archiveEvent(event.id);
    setArchiveOpen(false);
    navigate('/app/events');
  }

  if (loading && !event) return <Loader label="Loading event" />;
  if (error) return <ErrorState message={error} />;
  if (!event) return <ErrorState message="Event not found." />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to="/app/events">
        Back to events
      </Link>
      <EventHeader
        canArchive={eventPermission === 'edit'}
        canEdit={eventPermission === 'edit'}
        event={event}
        onArchive={() => setArchiveOpen(true)}
      />

      <section className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Event information</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">Date</dt>
                <dd className="font-medium">{formatEventDate(event.eventDate)}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Time</dt>
                <dd className="font-medium">{formatEventTime(event)}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Venue</dt>
                <dd className="font-medium">{event.location || 'Not set'}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Participants</dt>
                <dd className="font-medium">{event.participantCount}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold">Notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">
              {event.notes || 'No notes yet.'}
            </p>
          </Card>

          <EventParticipantsSection
            canManage={eventPermission === 'edit'}
            event={event}
            onChanged={() => {
              if (id) void loadEvent(id);
            }}
          />

        </div>

        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Status timeline</h2>
            <div className="mt-4">
              <EventTimeline status={event.status} />
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Record</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Created</dt>
                <dd className="font-medium">{formatDateTime(event.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Updated</dt>
                <dd className="font-medium">{formatDateTime(event.updatedAt)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </section>

      <ArchiveDialog
        event={event}
        isOpen={isArchiveOpen}
        isSaving={saving}
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => void handleArchive()}
      />
    </div>
  );
}
