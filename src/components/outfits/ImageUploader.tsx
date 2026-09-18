import { useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UploadProgress } from '@/components/outfits/UploadProgress';
import { useOutfitImageStore } from '@/store/outfitImageStore';
import type { Outfit } from '@/types/domain';
import { cx } from '@/utils/cx';

type ImageUploaderProps = {
  outfit: Outfit;
};

export function ImageUploader({ outfit }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setDragging] = useState(false);
  const images = useOutfitImageStore((state) => state.images);
  const upload = useOutfitImageStore((state) => state.uploadImage);
  const progress = useOutfitImageStore((state) => state.uploadProgress);
  const disabled = images.length >= 5 || progress > 0;

  async function uploadFiles(files: FileList | File[]) {
    const remaining = 5 - images.length;
    const selected = Array.from(files).slice(0, remaining);
    for (const file of selected) {
      await upload({ file, outfitId: outfit.id, weddingId: outfit.weddingId });
    }
  }

  return (
    <div
      className={cx(
        'rounded-md border border-dashed p-4 transition',
        isDragging ? 'border-brand-500 bg-brand-50' : 'border-slate-300 bg-slate-50',
      )}
      onDragLeave={() => setDragging(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) void uploadFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        disabled={disabled}
        multiple
        type="file"
        onChange={(event) => {
          if (event.target.files) void uploadFiles(event.target.files);
          event.currentTarget.value = '';
        }}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-slate-900">Add reference images</p>
          <p className="text-sm text-slate-600">{images.length}/5 images. Drop files here or use camera/gallery.</p>
        </div>
        <Button disabled={disabled} type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          Add Images
        </Button>
      </div>
      <div className="mt-3">
        <UploadProgress progress={progress} />
      </div>
    </div>
  );
}
