import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

type ParticipantEmptyStateProps = {
  canManage: boolean;
  onAdd: () => void;
};

export function ParticipantEmptyState({ canManage, onAdd }: ParticipantEmptyStateProps) {
  return (
    <EmptyState
      title="No participants yet"
      description="Add wedding members to this event before confirming it or planning outfits."
    >
      {canManage ? (
        <div className="mt-5">
          <Button onClick={onAdd}>Add Participant</Button>
        </div>
      ) : null}
    </EmptyState>
  );
}
