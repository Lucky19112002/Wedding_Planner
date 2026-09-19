import type { Outfit } from '@/types/domain';

export function OutfitImagePlaceholder({ outfit, size = 'card' }: { outfit: Outfit; size?: 'card' | 'hero' }) {
  if (outfit.primaryImageUrl) {
    return (
      <img
        alt={`${outfit.dressType ?? 'Outfit'} reference`}
        className={`rounded-md object-cover ${size === 'hero' ? 'min-h-72 w-full' : 'aspect-[4/3] w-full'}`}
        loading="lazy"
        src={outfit.primaryImageUrl}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-md bg-slate-100 text-center text-sm font-medium text-slate-500 ${
        size === 'hero' ? 'min-h-72' : 'aspect-[4/3]'
      }`}
    >
      {outfit.primaryImagePath ? 'Reference image attached' : 'Image coming in Phase 5.5'}
    </div>
  );
}
