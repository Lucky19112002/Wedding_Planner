import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { getAvailableCandidates, isDuplicateParticipant } from '@/utils/participantValidation';
import type { Participant, ParticipantCandidate, ParticipantInput, ParticipantUpdateInput } from '@/types/domain';

const roleSuggestions = ['Groom', 'Bride', 'Brother', 'Sister', 'Father', 'Mother', 'Friend', 'Relative', 'Guest'];

type AddParticipantDialogProps = {
  candidates: ParticipantCandidate[];
  eventId: string;
  isOpen: boolean;
  isSaving: boolean;
  participant?: Participant | null;
  participants: Participant[];
  search: string;
  weddingId: string;
  onAdd: (input: ParticipantInput) => Promise<void>;
  onClose: () => void;
  onSearch: (search: string) => void;
  onUpdate: (participantId: string, input: ParticipantUpdateInput) => Promise<void>;
};

export function AddParticipantDialog({
  candidates,
  eventId,
  isOpen,
  isSaving,
  onAdd,
  onClose,
  onSearch,
  onUpdate,
  participant,
  participants,
  search,
  weddingId,
}: AddParticipantDialogProps) {
  const [roleInEvent, setRoleInEvent] = useState(participant?.roleInEvent ?? '');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = Boolean(participant);
  const availableCandidates = useMemo(() => getAvailableCandidates(candidates, search), [candidates, search]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const role = roleInEvent.trim();
    if (!role) {
      setFormError('Role in event is required.');
      return;
    }

    if (participant) {
      await onUpdate(participant.id, { roleInEvent: role });
      onClose();
      return;
    }

    if (!selectedUserId) {
      setFormError('Choose a wedding member.');
      return;
    }
    if (isDuplicateParticipant(selectedUserId, participants)) {
      setFormError('This member is already a participant.');
      return;
    }

    await onAdd({ eventId, weddingId, userId: selectedUserId, roleInEvent: role });
    onClose();
  }

  return (
    <Modal isOpen={isOpen} title={isEditing ? 'Edit Participant' : 'Add Participant'} onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {!isEditing ? (
          <div className="space-y-3">
            <Input
              label="Search wedding members"
              placeholder="Name, email, or relationship"
              type="search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
            />
            <div className="max-h-56 space-y-2 overflow-auto rounded-md border border-slate-200 p-2">
              {availableCandidates.length > 0 ? (
                availableCandidates.map((candidate) => (
                  <button
                    className={`w-full rounded-md border p-3 text-left text-sm ${
                      selectedUserId === candidate.userId
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                    key={candidate.userId}
                    type="button"
                    onClick={() => setSelectedUserId(candidate.userId)}
                  >
                    <span className="block font-medium text-slate-950">{candidate.displayName}</span>
                    <span className="block text-slate-500">{candidate.relationshipNote || candidate.email}</span>
                  </button>
                ))
              ) : (
                <p className="p-3 text-sm text-slate-500">No available wedding members match this search.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-md bg-slate-50 p-3 text-sm">
            <p className="font-medium">{participant?.displayName}</p>
            <p className="text-slate-500">Linked user cannot be changed.</p>
          </div>
        )}

        <Input
          label="Role in Event"
          list="participant-role-suggestions"
          placeholder="Groom, Bride, Friend..."
          value={roleInEvent}
          onChange={(event) => setRoleInEvent(event.target.value)}
        />
        <datalist id="participant-role-suggestions">
          {roleSuggestions.map((role) => (
            <option key={role} value={role} />
          ))}
        </datalist>

        {formError ? <p className="text-sm text-rose-600">{formError}</p> : null}

        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button isLoading={isSaving} type="submit">
            {isEditing ? 'Save Changes' : 'Add Participant'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
