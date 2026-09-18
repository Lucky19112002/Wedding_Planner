import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { Loader } from '@/components/ui/Loader';
import { OutfitEmptyState, OutfitList } from '@/components/outfits';
import { getOutfits } from '@/services/outfit.service';
import type { Outfit, Participant } from '@/types/domain';

type ParticipantOutfitsSectionProps = {
  canManage: boolean;
  participant: Participant;
};

export function ParticipantOutfitsSection({ canManage, participant }: ParticipantOutfitsSectionProps) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void getOutfits(participant.id)
      .then((rows) => {
        if (active) setOutfits(rows);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Outfits could not be loaded.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [participant.id]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-semibold">Outfits</h4>
          <p className="text-sm text-slate-600">Plan looks for {participant.displayName}.</p>
        </div>
        {canManage ? (
          <Button asChild variant="secondary">
            <Link to={`/app/participants/${participant.id}/outfits/new`}>New Outfit</Link>
          </Button>
        ) : null}
      </div>
      {error ? <ErrorState message={error} /> : null}
      {loading ? <Loader label="Loading outfits" /> : null}
      {!loading && outfits.length === 0 ? (
        <OutfitEmptyState canCreate={canManage} participantId={participant.id} />
      ) : null}
      {!loading && outfits.length > 0 ? <OutfitList outfits={outfits} /> : null}
    </div>
  );
}
