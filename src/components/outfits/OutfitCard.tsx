import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { OutfitImagePlaceholder } from '@/components/outfits/OutfitImagePlaceholder';
import { OutfitStatusBadge } from '@/components/outfits/OutfitStatusBadge';
import { formatDateTime } from '@/utils/eventFormat';
import { formatOutfitSummary, formatOutfitTitle } from '@/utils/outfitFormat';
import type { Outfit } from '@/types/domain';

export function OutfitCard({ outfit }: { outfit: Outfit }) {
  return (
    <Link to={`/app/outfits/${outfit.id}`}>
      <Card className="h-full space-y-3 transition hover:-translate-y-0.5 hover:shadow-md">
        <OutfitImagePlaceholder outfit={outfit} />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-semibold">{formatOutfitTitle(outfit)}</h4>
            <p className="text-sm text-slate-600">{formatOutfitSummary(outfit)}</p>
          </div>
          <OutfitStatusBadge status={outfit.status} />
        </div>
        <dl className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <dt className="text-slate-500">Shopping links</dt>
            <dd className="font-medium">{outfit.shoppingLinkCount}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Updated</dt>
            <dd className="font-medium">{formatDateTime(outfit.updatedAt)}</dd>
          </div>
        </dl>
      </Card>
    </Link>
  );
}
