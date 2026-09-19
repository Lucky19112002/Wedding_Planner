import { useProfile } from '@/hooks/useProfile';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { can, getPermissionLevel } from '@/utils/permissions';
import type { PermissionAction, PermissionLevel, PermissionResource } from '@/types/domain';

export function usePermission(resource: PermissionResource): PermissionLevel;
export function usePermission(resource: PermissionResource, action: PermissionAction): boolean;
export function usePermission(resource: PermissionResource, action?: PermissionAction) {
  const { profile } = useProfile();
  const { activeMembership } = useWeddingContext();
  const level = getPermissionLevel(profile, activeMembership, resource);

  return action ? can(profile, activeMembership, resource, action) : level;
}
