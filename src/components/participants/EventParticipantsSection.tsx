import { useEffect, useState } from 'react';
import { AddParticipantDialog } from '@/components/participants/AddParticipantDialog';
import { ParticipantEmptyState } from '@/components/participants/ParticipantEmptyState';
import { ParticipantList } from '@/components/participants/ParticipantList';
import { RemoveParticipantDialog } from '@/components/participants/RemoveParticipantDialog';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { useParticipantStore } from '@/store/participantStore';
import type { Event, Participant } from '@/types/domain';

type EventParticipantsSectionProps = {
  canManage: boolean;
  event: Event;
  onChanged: () => void;
};

export function EventParticipantsSection({ canManage, event, onChanged }: EventParticipantsSectionProps) {
  const participants = useParticipantStore((state) => state.participants);
  const candidates = useParticipantStore((state) => state.candidates);
  const error = useParticipantStore((state) => state.error);
  const loading = useParticipantStore((state) => state.loading);
  const saving = useParticipantStore((state) => state.saving);
  const search = useParticipantStore((state) => state.search);
  const addParticipant = useParticipantStore((state) => state.addParticipant);
  const archiveParticipant = useParticipantStore((state) => state.archiveParticipant);
  const loadCandidates = useParticipantStore((state) => state.loadCandidates);
  const loadParticipants = useParticipantStore((state) => state.loadParticipants);
  const resetParticipants = useParticipantStore((state) => state.resetParticipants);
  const setSearch = useParticipantStore((state) => state.setSearch);
  const updateParticipant = useParticipantStore((state) => state.updateParticipant);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [participantToEdit, setParticipantToEdit] = useState<Participant | null>(null);
  const [participantToRemove, setParticipantToRemove] = useState<Participant | null>(null);

  useEffect(() => {
    void loadParticipants(event.id, event.weddingId);
    return () => resetParticipants();
  }, [event.id, event.weddingId, loadParticipants, resetParticipants]);

  async function openAddDialog() {
    setParticipantToEdit(null);
    setDialogOpen(true);
    await loadCandidates(event.id, event.weddingId);
  }

  async function openEditDialog(participant: Participant) {
    setParticipantToEdit(participant);
    setDialogOpen(true);
    await loadCandidates(event.id, event.weddingId);
  }

  async function handleRemove() {
    if (!participantToRemove) return;
    await archiveParticipant(participantToRemove.id);
    setParticipantToRemove(null);
    onChanged();
  }

  async function handleChanged() {
    await loadParticipants(event.id, event.weddingId);
    onChanged();
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Participants</h2>
          <p className="text-sm text-slate-600">Assign wedding members to this event and prepare for outfits.</p>
        </div>
        {canManage ? <Button onClick={() => void openAddDialog()}>Add Participant</Button> : null}
      </div>

      {error ? <ErrorState message={error} /> : null}
      {loading ? <Loader label="Loading participants" /> : null}
      {!loading && participants.length === 0 ? (
        <ParticipantEmptyState canManage={canManage} onAdd={() => void openAddDialog()} />
      ) : null}
      {!loading && participants.length > 0 ? (
        <ParticipantList
          canManage={canManage}
          participants={participants}
          onEdit={(participant) => void openEditDialog(participant)}
          onRemove={setParticipantToRemove}
        />
      ) : null}

      <Card className="text-sm text-slate-600">
        Outfit count is a placeholder until Phase 5.4 adds outfit management.
      </Card>

      {dialogOpen ? (
        <AddParticipantDialog
          candidates={candidates}
          eventId={event.id}
          isOpen={dialogOpen}
          isSaving={saving}
          key={participantToEdit?.id ?? 'new-participant'}
          participant={participantToEdit}
          participants={participants}
          search={search}
          weddingId={event.weddingId}
          onAdd={async (input) => {
            await addParticipant(input);
            await handleChanged();
          }}
          onClose={() => setDialogOpen(false)}
          onSearch={setSearch}
          onUpdate={async (participantId, input) => {
            await updateParticipant(participantId, input);
            await handleChanged();
          }}
        />
      ) : null}
      <RemoveParticipantDialog
        isOpen={Boolean(participantToRemove)}
        isSaving={saving}
        participant={participantToRemove}
        onClose={() => setParticipantToRemove(null)}
        onConfirm={() => void handleRemove()}
      />
    </section>
  );
}
