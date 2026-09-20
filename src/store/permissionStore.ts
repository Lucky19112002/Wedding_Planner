import { create } from 'zustand';
import {
  deactivateUser,
  getEventPermissions,
  getUsers,
  updateEventPermission,
  updatePermissions,
  updateRole,
} from '@/services/permission.service';
import type { EventPermissionLevel, InvitationStatus, ManagedUser, UserEventPermission, WeddingRole } from '@/types/domain';

type UserStatusFilter = 'all' | 'active' | 'deactivated' | InvitationStatus;

type PermissionStore = {
  users: ManagedUser[];
  eventPermissions: UserEventPermission[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  search: string;
  roleFilter: WeddingRole | 'all';
  statusFilter: UserStatusFilter;
  setSearch: (search: string) => void;
  setRoleFilter: (roleFilter: WeddingRole | 'all') => void;
  setStatusFilter: (statusFilter: UserStatusFilter) => void;
  clearError: () => void;
  loadUsers: (weddingId: string) => Promise<void>;
  updateEventPermission: (weddingId: string, eventId: string, userId: string, level: EventPermissionLevel) => Promise<void>;
  updateRole: (weddingId: string, membershipId: string, role: WeddingRole) => Promise<void>;
  updatePermissions: (weddingId: string, membershipId: string, role: WeddingRole) => Promise<void>;
  deactivateUser: (weddingId: string, userId: string) => Promise<void>;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  users: [],
  eventPermissions: [],
  loading: false,
  saving: false,
  error: null,
  search: '',
  roleFilter: 'all',
  statusFilter: 'all',
  setSearch: (search) => set({ search }),
  setRoleFilter: (roleFilter) => set({ roleFilter }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  clearError: () => set({ error: null }),
  loadUsers: async (weddingId) => {
    set({ loading: true, error: null });
    try {
      const [users, eventPermissions] = await Promise.all([getUsers(weddingId), getEventPermissions(weddingId)]);
      set({ users, eventPermissions, loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Users could not be loaded.'), loading: false });
    }
  },
  updateEventPermission: async (weddingId, eventId, userId, level) => {
    set({ saving: true, error: null });
    try {
      await updateEventPermission(eventId, userId, level);
      set({ eventPermissions: await getEventPermissions(weddingId), saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Event permission could not be updated.'), saving: false });
      throw error;
    }
  },
  updateRole: async (weddingId, membershipId, role) => {
    set({ saving: true, error: null });
    try {
      await updateRole(membershipId, role);
      const [users, eventPermissions] = await Promise.all([getUsers(weddingId), getEventPermissions(weddingId)]);
      set({ users, eventPermissions, saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Role could not be updated.'), saving: false });
      throw error;
    }
  },
  updatePermissions: async (weddingId, membershipId, role) => {
    set({ saving: true, error: null });
    try {
      await updatePermissions(membershipId, role);
      const [users, eventPermissions] = await Promise.all([getUsers(weddingId), getEventPermissions(weddingId)]);
      set({ users, eventPermissions, saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Permissions could not be updated.'), saving: false });
      throw error;
    }
  },
  deactivateUser: async (weddingId, userId) => {
    set({ saving: true, error: null });
    try {
      await deactivateUser(userId);
      const [users, eventPermissions] = await Promise.all([getUsers(weddingId), getEventPermissions(weddingId)]);
      set({ users, eventPermissions, saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'User could not be deactivated.'), saving: false });
      throw error;
    }
  },
}));
