import { Card } from '@/components/ui/Card';
import { OutfitImagePlaceholder } from '@/components/outfits/OutfitImagePlaceholder';
import type { Outfit } from '@/types/domain';

export function OutfitGallery({ outfit }: { outfit: Outfit }) {
  return (
    <Card>
      <h2 className="text-lg font-semibold">Image gallery</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <OutfitImagePlaceholder outfit={outfit} />
        <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-600">
          Reference image upload and gallery management start in Phase 5.5.
        </div>
      </div>
    </Card>
  );
}
