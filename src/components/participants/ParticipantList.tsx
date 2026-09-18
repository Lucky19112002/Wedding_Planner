import { ParticipantCard } from '@/components/participants/ParticipantCard';
import type { Participant } from '@/types/domain';

type ParticipantListProps = {
  canManage: boolean;
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onRemove: (participant: Participant) => void;
};

export function ParticipantList({ canManage, onEdit, onRemove, participants }: ParticipantListProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {participants.map((participant) => (
        <ParticipantCard
          canManage={canManage}
          key={participant.id}
          participant={participant}
          onEdit={onEdit}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
