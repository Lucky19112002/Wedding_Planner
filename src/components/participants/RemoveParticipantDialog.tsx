import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Participant } from '@/types/domain';

type RemoveParticipantDialogProps = {
  isOpen: boolean;
  isSaving: boolean;
  participant: Participant | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function RemoveParticipantDialog({
  isOpen,
  isSaving,
  onClose,
  onConfirm,
  participant,
}: RemoveParticipantDialogProps) {
  return (
    <Modal isOpen={isOpen} title="Remove Participant" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Remove {participant?.displayName ?? 'this participant'} from this event? The user account stays active and
          the participant history is archived.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700" isLoading={isSaving} onClick={onConfirm}>
            Remove
          </Button>
        </div>
      </div>
    </Modal>
  );
}
