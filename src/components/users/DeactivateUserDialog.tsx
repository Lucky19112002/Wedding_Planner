import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { ManagedUser } from '@/types/domain';

type DeactivateUserDialogProps = {
  isOpen: boolean;
  isSaving?: boolean;
  user: ManagedUser | null;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeactivateUserDialog({
  isOpen,
  isSaving = false,
  onClose,
  onConfirm,
  user,
}: DeactivateUserDialogProps) {
  return (
    <Modal isOpen={isOpen} title="Deactivate user" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Deactivating {user?.displayName ?? 'this user'} prevents future product access while preserving
          their event, participant, and outfit history.
        </p>
        <div className="flex gap-2">
          <Button className="flex-1" variant="secondary" type="button" onClick={onClose}>
            Keep active
          </Button>
          <Button className="flex-1" type="button" isLoading={isSaving} onClick={onConfirm}>
            Deactivate
          </Button>
        </div>
      </div>
    </Modal>
  );
}
