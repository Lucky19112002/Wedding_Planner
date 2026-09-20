import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArchiveOutfitDialog,
  OutfitGallery,
  OutfitStatusBadge,
  OutfitTimeline,
  ShoppingLinksPanel,
} from '@/components/outfits';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { usePermission } from '@/hooks/usePermission';
import { getParticipants } from '@/services/participant.service';
import { getMyEventPermission } from '@/services/permission.service';
import { useOutfitStore } from '@/store/outfitStore';
import { formatDateTime } from '@/utils/eventFormat';
import { formatOutfitSummary, formatOutfitTitle } from '@/utils/outfitFormat';
import type { Participant } from '@/types/domain';

export function OutfitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const outfit = useOutfitStore((state) => state.selectedOutfit);
  const error = useOutfitStore((state) => state.error);
  const loading = useOutfitStore((state) => state.loading);
  const saving = useOutfitStore((state) => state.saving);
  const archiveOutfit = useOutfitStore((state) => state.archiveOutfit);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const switchOutfitParticipant = useOutfitStore((state) => state.switchOutfitParticipant);
  const canSwitchOwner = usePermission('outfits', 'admin');
  const [isArchiveOpen, setArchiveOpen] = useState(false);
  const [isSwitchOpen, setSwitchOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [nextParticipantId, setNextParticipantId] = useState('');
  const [switchError, setSwitchError] = useState<string | null>(null);
  const [canManage, setCanManage] = useState(false);

  useEffect(() => {
    if (id) void loadOutfit(id);
  }, [id, loadOutfit]);

  useEffect(() => {
    if (!outfit) return;
    void getMyEventPermission(outfit.eventId)
      .then((level) => setCanManage(level === 'edit'))
      .catch(() => setCanManage(false));
  }, [outfit]);

  useEffect(() => {
    if (!isSwitchOpen || !outfit) return;
    void getParticipants(outfit.eventId, outfit.weddingId)
      .then(setParticipants)
      .catch((error: unknown) => setSwitchError(error instanceof Error ? error.message : 'Participants could not be loaded.'));
  }, [isSwitchOpen, outfit]);

  function openSwitchOwner() {
    if (!outfit) return;
    setNextParticipantId(outfit.participantId);
    setSwitchError(null);
    setSwitchOpen(true);
  }

  async function handleArchive() {
    if (!outfit) return;
    await archiveOutfit(outfit.id);
    setArchiveOpen(false);
    navigate('/app/events');
  }

  async function handleSwitchOwner() {
    if (!outfit || !nextParticipantId || nextParticipantId === outfit.participantId) return;
    try {
      await switchOutfitParticipant(outfit.id, nextParticipantId);
      setSwitchOpen(false);
    } catch (error) {
      setSwitchError(error instanceof Error ? error.message : 'Outfit owner could not be changed.');
    }
  }

  if (loading && !outfit) return <Loader label="Loading outfit" />;
  if (error) return <ErrorState message={error} />;
  if (!outfit) return <ErrorState message="Outfit not found." />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to="/app/events">
        Back to events
      </Link>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <OutfitGallery canManage={canManage} outfit={outfit} />
        <Card className="space-y-4">
          <OutfitStatusBadge status={outfit.status} />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{formatOutfitTitle(outfit)}</h1>
            <p className="mt-2 text-sm text-slate-600">{formatOutfitSummary(outfit)}</p>
          </div>
          {canManage ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link to={`/app/outfits/${outfit.id}/edit`}>Edit</Link>
              </Button>
              {canSwitchOwner ? (
                <Button variant="secondary" onClick={openSwitchOwner}>
                  Switch User
                </Button>
              ) : null}
              <Button variant="ghost" onClick={() => setArchiveOpen(true)}>
                Archive
              </Button>
            </div>
          ) : null}
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Outfit information</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">Dress type</dt>
                <dd className="font-medium">{outfit.dressType}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Colour</dt>
                <dd className="font-medium">{outfit.colour}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Quantity</dt>
                <dd className="font-medium">{outfit.quantity}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Shopping links</dt>
                <dd className="font-medium">{outfit.shoppingLinkCount}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Person</dt>
                <dd className="font-medium">{outfit.participantName ?? 'Former user'}</dd>
              </div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{outfit.notes || 'No notes yet.'}</p>
          </Card>
          <ShoppingLinksPanel canManage={canManage} outfit={outfit} />
        </div>
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Status timeline</h2>
            <div className="mt-4">
              <OutfitTimeline status={outfit.status} />
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Record</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Created</dt>
                <dd className="font-medium">{formatDateTime(outfit.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Updated</dt>
                <dd className="font-medium">{formatDateTime(outfit.updatedAt)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </section>

      <Modal isOpen={isSwitchOpen} title="Switch User" onClose={() => setSwitchOpen(false)}>
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Current person: <span className="font-medium text-slate-900">{outfit.participantName ?? 'Former user'}</span>
          </p>
          <Select
            label="Change owner to"
            value={nextParticipantId}
            onChange={(event) => setNextParticipantId(event.target.value)}
          >
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                {participant.displayName} {participant.roleInEvent ? `(${participant.roleInEvent})` : ''}
              </option>
            ))}
          </Select>
          {switchError ? <p className="text-sm text-red-600">{switchError}</p> : null}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" onClick={() => setSwitchOpen(false)}>
              Cancel
            </Button>
            <Button
              isLoading={saving}
              disabled={!nextParticipantId || nextParticipantId === outfit.participantId}
              onClick={() => void handleSwitchOwner()}
            >
              Save owner
            </Button>
          </div>
        </div>
      </Modal>

      <ArchiveOutfitDialog
        outfit={outfit}
        isOpen={isArchiveOpen}
        isSaving={saving}
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => void handleArchive()}
      />
    </div>
  );
}
