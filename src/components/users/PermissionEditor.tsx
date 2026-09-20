import { Select } from '@/components/ui/Select';
import type { Event, EventPermissionLevel, ManagedUser, UserEventPermission } from '@/types/domain';

type PermissionEditorProps = {
  disabled?: boolean;
  events: Event[];
  permissions: UserEventPermission[];
  user: ManagedUser;
  onPermissionChange: (eventId: string, level: EventPermissionLevel) => void;
};

function getLevel(permissions: UserEventPermission[], eventId: string): EventPermissionLevel {
  return permissions.find((permission) => permission.eventId === eventId)?.level ?? 'view';
}

export function PermissionEditor({
  disabled = false,
  events,
  onPermissionChange,
  permissions,
  user,
}: PermissionEditorProps) {
  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">Event permissions</h3>
        <p className="mt-1 text-sm text-slate-600">Choose View or Edit for each event. Edit allows clothing changes.</p>
      </div>

      <div className="overflow-hidden rounded-md border border-slate-200">
        <div className="grid grid-cols-[1fr_140px] bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <div className="px-3 py-2">Event</div>
          <div className="px-3 py-2">Level</div>
        </div>
        {events.map((event) => (
          <div key={event.id} className="grid grid-cols-[1fr_140px] border-t border-slate-200 text-sm">
            <div className="px-3 py-3 font-medium text-slate-700">{event.name}</div>
            <div className="px-3 py-2">
              <Select
                aria-label={`${user.displayName} ${event.name} permission`}
                value={getLevel(permissions, event.id)}
                disabled={disabled || user.isDeactivated}
                onChange={(change) => onPermissionChange(event.id, change.target.value as EventPermissionLevel)}
              >
                <option value="view">View</option>
                <option value="edit">Edit</option>
              </Select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
