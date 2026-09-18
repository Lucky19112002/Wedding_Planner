import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export function OutfitEmptyState({ canCreate, participantId }: { canCreate: boolean; participantId: string }) {
  return (
    <EmptyState
      title="No outfits yet"
      description="Create the first outfit plan for this participant."
    >
      {canCreate ? (
        <div className="mt-5">
          <Button asChild>
            <Link to={`/app/participants/${participantId}/outfits/new`}>New Outfit</Link>
          </Button>
        </div>
      ) : null}
    </EmptyState>
  );
}
