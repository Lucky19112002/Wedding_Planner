import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PermissionEditor } from '@/components/users/PermissionEditor';
import type { ManagedUser, WeddingRole } from '@/types/domain';
import { weddingRoleLabels } from '@/utils/permissions';

type UserCardProps = {
  canManage: boolean;
  isSaving?: boolean;
  user: ManagedUser;
  onDeactivate: (user: ManagedUser) => void;
  onRoleChange: (user: ManagedUser, role: WeddingRole) => void;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(value));
}

export function UserCard({ canManage, isSaving = false, onDeactivate, onRoleChange, user }: UserCardProps) {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-3">
        <Avatar name={user.displayName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-base font-semibold">{user.displayName}</h2>
            <Badge>{user.systemRole === 'super_admin' ? 'Super Admin' : 'User'}</Badge>
            <Badge>{weddingRoleLabels[user.weddingRole]}</Badge>
            {user.isDeactivated ? <Badge className="bg-red-50 text-red-700">Deactivated</Badge> : null}
          </div>
          <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
          <p className="mt-1 text-xs text-slate-500">
            Invite status: {user.invitationStatus} · Updated {formatDate(user.updatedAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" type="button" onClick={() => setExpanded((value) => !value)}>
          {isExpanded ? 'Hide permissions' : 'Manage permissions'}
        </Button>
        {canManage && !user.isDeactivated ? (
          <Button variant="ghost" type="button" onClick={() => onDeactivate(user)}>
            Deactivate
          </Button>
        ) : null}
      </div>

      {isExpanded ? (
        <PermissionEditor
          disabled={!canManage || isSaving}
          user={user}
          onRoleChange={(role) => onRoleChange(user, role)}
        />
      ) : null}
    </Card>
  );
}
