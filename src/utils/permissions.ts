import type {
  Membership,
  PermissionAction,
  PermissionLevel,
  PermissionResource,
  Profile,
  WeddingRole,
} from '@/types/domain';

const none: PermissionLevel = { view: false, create: false, edit: false, admin: false };
const viewOnly: PermissionLevel = { view: true, create: false, edit: false, admin: false };
const full: PermissionLevel = { view: true, create: true, edit: true, admin: true };

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
  return membership.role.charAt(0).toUpperCase() + membership.role.slice(1);
}
