import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArchiveOutfitDialog,
  OutfitGallery,
  OutfitStatusBadge,
  OutfitTimeline,
  ShoppingLinksPanel,
} from '@/components/outfits';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { useOutfitStore } from '@/store/outfitStore';
import { formatDateTime } from '@/utils/eventFormat';
import { formatOutfitSummary, formatOutfitTitle } from '@/utils/outfitFormat';

export function OutfitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const outfit = useOutfitStore((state) => state.selectedOutfit);
  const error = useOutfitStore((state) => state.error);
  const loading = useOutfitStore((state) => state.loading);
  const saving = useOutfitStore((state) => state.saving);
  const archiveOutfit = useOutfitStore((state) => state.archiveOutfit);
  const loadOutfit = useOutfitStore((state) => state.loadOutfit);
  const [isArchiveOpen, setArchiveOpen] = useState(false);

  useEffect(() => {
    if (id) void loadOutfit(id);
  }, [id, loadOutfit]);

  async function handleArchive() {
    if (!outfit) return;
    await archiveOutfit(outfit.id);
    setArchiveOpen(false);
    navigate('/app/events');
  }

  if (loading && !outfit) return <Loader label="Loading outfit" />;
  if (error) return <ErrorState message={error} />;
  if (!outfit) return <ErrorState message="Outfit not found." />;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <Link className="text-sm font-medium text-brand-700" to="/app/events">
        Back to events
      </Link>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <OutfitGallery outfit={outfit} />
        <Card className="space-y-4">
          <OutfitStatusBadge status={outfit.status} />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{formatOutfitTitle(outfit)}</h1>
            <p className="mt-2 text-sm text-slate-600">{formatOutfitSummary(outfit)}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link to={`/app/outfits/${outfit.id}/edit`}>Edit</Link>
            </Button>
            <Button variant="ghost" onClick={() => setArchiveOpen(true)}>
              Archive
            </Button>
          </div>
        </Card>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Outfit information</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">Dress type</dt>
                <dd className="font-medium">{outfit.dressType}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Colour</dt>
                <dd className="font-medium">{outfit.colour}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Quantity</dt>
                <dd className="font-medium">{outfit.quantity}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Shopping links</dt>
                <dd className="font-medium">{outfit.shoppingLinkCount}</dd>
              </div>
            </dl>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Notes</h2>
            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-600">{outfit.notes || 'No notes yet.'}</p>
          </Card>
          <ShoppingLinksPanel outfit={outfit} />
        </div>
        <div className="space-y-5">
          <Card>
            <h2 className="text-lg font-semibold">Status timeline</h2>
            <div className="mt-4">
              <OutfitTimeline status={outfit.status} />
            </div>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold">Record</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Created</dt>
                <dd className="font-medium">{formatDateTime(outfit.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Updated</dt>
                <dd className="font-medium">{formatDateTime(outfit.updatedAt)}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </section>

      <ArchiveOutfitDialog
        outfit={outfit}
        isOpen={isArchiveOpen}
        isSaving={saving}
        onClose={() => setArchiveOpen(false)}
        onConfirm={() => void handleArchive()}
      />
    </div>
  );
}
