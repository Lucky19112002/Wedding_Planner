import type {
  ManagedPermissionResource,
  Membership,
  PermissionMatrix,
  PermissionAction,
  PermissionLevel,
  PermissionResource,
  Profile,
  WeddingRole,
} from '@/types/domain';

const none: PermissionLevel = { view: false, create: false, edit: false, admin: false };
const viewOnly: PermissionLevel = { view: true, create: false, edit: false, admin: false };
const full: PermissionLevel = { view: true, create: true, edit: true, admin: true };
export const managedPermissionResources: ManagedPermissionResource[] = [
  'events',
  'participants',
  'outfits',
  'users',
];
export const permissionActions: PermissionAction[] = ['view', 'create', 'edit', 'admin'];
export const weddingRoleLabels: Record<WeddingRole, string> = {
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

function rolePermissions(role: WeddingRole, resource: PermissionResource): PermissionLevel {
  if (role === 'admin') {
    if (resource === 'weddings') return { view: true, create: false, edit: true, admin: false };
    return full;
  }

  if (role === 'member') {
    if (resource === 'users') return { view: true, create: false, edit: true, admin: false };
    if (resource === 'outfits') return { view: true, create: true, edit: true, admin: false };
    return viewOnly;
  }

  return viewOnly;
}

export function getPermissionLevel(
  profile: Profile | null,
  membership: Membership | null,
  resource: PermissionResource,
): PermissionLevel {
  if (profile?.isSuperAdmin) return full;
  if (!membership) return none;
  return rolePermissions(membership.role, resource);
}

export function can(
  profile: Profile | null,
  membership: Membership | null,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  return getPermissionLevel(profile, membership, resource)[action];
}

export function getDisplayRole(profile: Profile | null, membership: Membership | null): string {
  if (profile?.isSuperAdmin) return 'Super Admin';
  if (!membership) return 'No membership';
  return weddingRoleLabels[membership.role];
}

export function getRolePermissionMatrix(role: WeddingRole): PermissionMatrix {
  return managedPermissionResources.reduce((matrix, resource) => {
    matrix[resource] = rolePermissions(role, resource);
    return matrix;
  }, {} as PermissionMatrix);
}

export function isLastSuperAdmin(target: Profile, activeProfiles: Profile[]): boolean {
  if (!target.isSuperAdmin) return false;
  return activeProfiles.filter((profile) => profile.isSuperAdmin && !profile.isDeactivated).length <= 1;
}
