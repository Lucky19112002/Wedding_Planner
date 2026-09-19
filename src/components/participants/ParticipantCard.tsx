import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ParticipantAvatar } from '@/components/participants/ParticipantAvatar';
import { ParticipantRoleBadge } from '@/components/participants/ParticipantRoleBadge';
import { formatDateTime } from '@/utils/eventFormat';
import type { Participant } from '@/types/domain';

type ParticipantCardProps = {
  canManage: boolean;
  participant: Participant;
  onEdit: (participant: Participant) => void;
  onRemove: (participant: Participant) => void;
};

export function ParticipantCard({ canManage, onEdit, onRemove, participant }: ParticipantCardProps) {
  return (
    <Card className="space-y-4">
      <div className="flex gap-3">
        <ParticipantAvatar name={participant.displayName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="truncate font-semibold">{participant.displayName}</h3>
              <p className="text-sm text-slate-500">{participant.relationshipNote || 'Relationship not set'}</p>
            </div>
            <ParticipantRoleBadge role={participant.memberRole} />
          </div>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-slate-500">Role in event</dt>
              <dd className="font-medium">{participant.roleInEvent || 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Outfits</dt>
              <dd className="font-medium">{participant.outfitCount} planned</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500">Last updated</dt>
              <dd className="font-medium">{formatDateTime(participant.updatedAt)}</dd>
            </div>
          </dl>
        </div>
      </div>

      {canManage ? (
        <div className="flex gap-2 border-t border-slate-100 pt-3">
          <Button className="flex-1" variant="secondary" onClick={() => onEdit(participant)}>
            Edit
          </Button>
          <Button className="flex-1 text-rose-700 hover:bg-rose-50" variant="ghost" onClick={() => onRemove(participant)}>
            Remove
          </Button>
        </div>
      ) : null}
    </Card>
  );
}
