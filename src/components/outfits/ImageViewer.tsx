import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { OutfitImage } from '@/types/domain';

type ImageViewerProps = {
  image: OutfitImage | null;
  onClose: () => void;
};

export function ImageViewer({ image, onClose }: ImageViewerProps) {
  return (
    <Modal isOpen={Boolean(image)} title="Reference image" onClose={onClose}>
      {image ? (
        <div className="space-y-4">
          <img alt="Reference preview" className="max-h-[72vh] w-full rounded-md object-contain" src={image.signedUrl ?? ''} />
          <Button className="w-full" type="button" variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : null}
    </Modal>
  );
}
