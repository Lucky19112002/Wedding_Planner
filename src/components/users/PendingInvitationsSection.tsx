import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Invitation } from '@/types/domain';
import { weddingRoleLabels } from '@/utils/permissions';

type PendingInvitationsSectionProps = {
  invitations: Invitation[];
  isSaving?: boolean;
  onCancel: (invitation: Invitation) => void;
  onResend: (invitation: Invitation) => void;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

export function PendingInvitationsSection({
  invitations,
  isSaving = false,
  onCancel,
  onResend,
}: PendingInvitationsSectionProps) {
  if (invitations.length === 0) {
    return (
      <Card className="text-sm text-slate-600">
        No pending invitations. Invite links will appear here until they are accepted, rejected, expired,
        or cancelled.
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {invitations.map((invitation) => (
        <Card key={invitation.id} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-semibold">{invitation.email}</h3>
                <Badge>{invitation.status}</Badge>
                <Badge>{weddingRoleLabels[invitation.invitedRole]}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                {invitation.weddingName ?? 'Wedding'} · invited by {invitation.invitedBy ?? 'Admin'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Sent {formatDate(invitation.createdAt)} · expires {formatDate(invitation.expiresAt)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                disabled={isSaving}
                type="button"
                variant="secondary"
                onClick={() => onResend(invitation)}
              >
                Resend
              </Button>
              <Button
                disabled={isSaving}
                type="button"
                variant="ghost"
                onClick={() => onCancel(invitation)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
