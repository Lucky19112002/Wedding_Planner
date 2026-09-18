import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import type { ManagedUser, WeddingRole } from '@/types/domain';
import {
  getRolePermissionMatrix,
  managedPermissionResources,
  permissionActions,
  weddingRoleLabels,
} from '@/utils/permissions';

type PermissionEditorProps = {
  disabled?: boolean;
  user: ManagedUser;
  onRoleChange: (role: WeddingRole) => void;
};

const resourceLabels = {
  events: 'Events',
  participants: 'Participants',
  outfits: 'Outfits',
  users: 'Users',
};

const actionLabels = {
  view: 'View',
  create: 'Create',
  edit: 'Edit',
  admin: 'Admin',
};

export function PermissionEditor({ disabled = false, onRoleChange, user }: PermissionEditorProps) {
  const matrix = getRolePermissionMatrix(user.weddingRole);

  return (
    <div className="space-y-4">
      <Select
        label="Permission preset"
        value={user.weddingRole}
        disabled={disabled || user.isDeactivated}
        onChange={(event) => onRoleChange(event.target.value as WeddingRole)}
      >
        {(['admin', 'member', 'viewer'] as WeddingRole[]).map((role) => (
          <option key={role} value={role}>
            {weddingRoleLabels[role]}
          </option>
        ))}
      </Select>

      <div className="overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[1fr_repeat(4,minmax(64px,80px))] bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div className="px-3 py-2">Resource</div>
          {permissionActions.map((action) => (
            <div key={action} className="px-2 py-2 text-center">
              {actionLabels[action]}
            </div>
          ))}
        </div>
        {managedPermissionResources.map((resource) => (
          <div
            key={resource}
            className="grid grid-cols-[1fr_repeat(4,minmax(64px,80px))] border-t border-slate-200 text-sm"
          >
            <div className="px-3 py-2 font-medium text-slate-700">{resourceLabels[resource]}</div>
            {permissionActions.map((action) => (
              <div key={action} className="flex justify-center px-2 py-2">
                <input
                  aria-label={`${resourceLabels[resource]} ${actionLabels[action]}`}
                  checked={matrix[resource][action]}
                  className="h-4 w-4 accent-violet-600"
                  readOnly
                  type="checkbox"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <Button
        className="w-full"
        disabled={disabled || user.isDeactivated}
        type="button"
        variant="secondary"
        onClick={() => onRoleChange(user.weddingRole)}
      >
        Save permissions
      </Button>
    </div>
  );
}
