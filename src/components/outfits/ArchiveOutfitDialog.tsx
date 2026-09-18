import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatOutfitTitle } from '@/utils/outfitFormat';
import type { Outfit } from '@/types/domain';

type ArchiveOutfitDialogProps = {
  outfit: Outfit | null;
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ArchiveOutfitDialog({ outfit, isOpen, isSaving, onClose, onConfirm }: ArchiveOutfitDialogProps) {
  return (
    <Modal isOpen={isOpen} title="Archive Outfit" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Archive {outfit ? formatOutfitTitle(outfit) : 'this outfit'}? It will be hidden from active planning and kept in history.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-rose-600 hover:bg-rose-700" isLoading={isSaving} onClick={onConfirm}>
            Archive
          </Button>
        </div>
      </div>
    </Modal>
  );
}
