import { OutfitCard } from '@/components/outfits/OutfitCard';
import type { Outfit } from '@/types/domain';

export function OutfitList({ outfits }: { outfits: Outfit[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {outfits.map((outfit) => (
        <OutfitCard key={outfit.id} outfit={outfit} />
      ))}
    </div>
  );
}
