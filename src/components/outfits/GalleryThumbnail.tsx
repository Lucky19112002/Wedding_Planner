import { Button } from '@/components/ui/Button';
import type { OutfitImage } from '@/types/domain';
import { cx } from '@/utils/cx';

type GalleryThumbnailProps = {
  image: OutfitImage;
  index: number;
  isActive: boolean;
  isFirst: boolean;
  isLast: boolean;
  onDelete?: (image: OutfitImage) => void;
  onMove?: (imageId: string, direction: -1 | 1) => void;
  onSelect: (image: OutfitImage) => void;
  onSetPrimary?: (imageId: string) => void;
};

export function GalleryThumbnail({
  image,
  index,
  isActive,
  isFirst,
  isLast,
  onDelete,
  onMove,
  onSelect,
  onSetPrimary,
}: GalleryThumbnailProps) {
  return (
    <div className="w-32 shrink-0 scroll-ml-4 space-y-2">
      <button
        className={cx(
          'aspect-square w-full overflow-hidden rounded-md border bg-slate-100',
          isActive ? 'border-brand-600 ring-2 ring-brand-200' : 'border-slate-200',
        )}
        type="button"
        onClick={() => onSelect(image)}
      >
        <img alt={`Reference ${index + 1}`} className="h-full w-full object-cover" loading="lazy" src={image.signedUrl ?? ''} />
      </button>
      {onDelete && onMove && onSetPrimary ? (
        <div className="grid grid-cols-2 gap-1">
          <Button className="min-h-9 px-2" disabled={isFirst} type="button" variant="secondary" onClick={() => onMove(image.id, -1)}>
            Up
          </Button>
          <Button className="min-h-9 px-2" disabled={isLast} type="button" variant="secondary" onClick={() => onMove(image.id, 1)}>
            Down
          </Button>
          <Button className="min-h-9 px-2" disabled={isFirst} type="button" variant="ghost" onClick={() => onSetPrimary(image.id)}>
            Primary
          </Button>
          <Button className="min-h-9 px-2" type="button" variant="ghost" onClick={() => onDelete(image)}>
            Delete
          </Button>
        </div>
      ) : null}
    </div>
  );
}
