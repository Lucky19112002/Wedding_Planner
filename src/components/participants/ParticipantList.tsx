import { ParticipantCard } from '@/components/participants/ParticipantCard';
import { ParticipantOutfitsSection } from '@/components/outfits/ParticipantOutfitsSection';
import type { Participant } from '@/types/domain';

type ParticipantListProps = {
  canManage: boolean;
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onRemove: (participant: Participant) => void;
};

export function ParticipantList({ canManage, onEdit, onRemove, participants }: ParticipantListProps) {
  return (
    <div className="space-y-5">
      {participants.map((participant) => (
        <section className="space-y-3" key={participant.id}>
          <ParticipantCard
            canManage={canManage}
            participant={participant}
            onEdit={onEdit}
            onRemove={onRemove}
          />
          <ParticipantOutfitsSection canManage={canManage} participant={participant} />
        </section>
      ))}
    </div>
  );
}
