import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { EmptyGallery } from '@/components/outfits/EmptyGallery';
import { GalleryThumbnail } from '@/components/outfits/GalleryThumbnail';
import { ImageUploader } from '@/components/outfits/ImageUploader';
import { ImageViewer } from '@/components/outfits/ImageViewer';
import { useOutfitImageStore } from '@/store/outfitImageStore';
import type { Outfit, OutfitImage } from '@/types/domain';

export function OutfitGallery({ canManage, outfit }: { canManage: boolean; outfit: Outfit }) {
  const images = useOutfitImageStore((state) => state.images);
  const loading = useOutfitImageStore((state) => state.loading);
  const error = useOutfitImageStore((state) => state.error);
  const loadImages = useOutfitImageStore((state) => state.loadImages);
  const deleteImage = useOutfitImageStore((state) => state.deleteImage);
  const moveImage = useOutfitImageStore((state) => state.moveImage);
  const setPrimaryImage = useOutfitImageStore((state) => state.setPrimaryImage);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [preview, setPreview] = useState<OutfitImage | null>(null);

  useEffect(() => {
    void loadImages(outfit.id);
  }, [loadImages, outfit.id]);

  const activeImage = useMemo(
    () => images.find((image) => image.id === activeId) ?? images[0] ?? null,
    [activeId, images],
  );

  return (
    <Card className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Image gallery</h2>
          <p className="text-sm text-slate-600">Private signed URLs, up to 5 images.</p>
        </div>
      </div>

      {error ? <ErrorState message={error} /> : null}
      {loading ? <Loader label="Loading images" /> : null}

      {!loading && activeImage ? (
        <button
          className="block aspect-[4/3] w-full overflow-hidden rounded-md bg-slate-100"
          type="button"
          onClick={() => setPreview(activeImage)}
        >
          <img
            alt="Primary reference"
            className="h-full w-full object-cover"
            loading="lazy"
            src={activeImage.signedUrl ?? ''}
          />
        </button>
      ) : null}

      {!loading && images.length === 0 ? <EmptyGallery /> : null}

      {images.length > 0 ? (
        <div className="flex snap-x gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <GalleryThumbnail
              key={image.id}
              image={image}
              index={index}
              isActive={activeImage?.id === image.id}
              isFirst={index === 0}
              isLast={index === images.length - 1}
              onDelete={canManage ? (item) => {
                if (window.confirm('Delete this reference image?')) void deleteImage(item);
              } : undefined}
              onMove={canManage ? (imageId, direction) => void moveImage(imageId, direction) : undefined}
              onSelect={(item) => setActiveId(item.id)}
              onSetPrimary={canManage ? (imageId) => void setPrimaryImage(imageId) : undefined}
            />
          ))}
        </div>
      ) : null}

      {canManage ? <ImageUploader outfit={outfit} /> : null}
      <ImageViewer image={preview} onClose={() => setPreview(null)} />
    </Card>
  );
}
