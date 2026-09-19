import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Event } from '@/types/domain';

type ArchiveDialogProps = {
  event: Event | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ArchiveDialog({ event, isOpen, isSaving, onClose, onConfirm }: ArchiveDialogProps) {
  return (
    <Modal isOpen={isOpen} title="Archive event" onClose={onClose}>
      <p className="text-sm text-slate-600">
        Archive {event ? <strong>{event.name}</strong> : 'this event'}? This hides it from active
        planning and keeps its history for later restore.
      </p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={isSaving} onClick={onConfirm}>
          Archive
        </Button>
      </div>
    </Modal>
  );
}
