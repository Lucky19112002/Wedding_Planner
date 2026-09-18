import { create } from 'zustand';
import {
  deactivateUser,
  getUsers,
  updatePermissions,
  updateRole,
} from '@/services/permission.service';
import type { InvitationStatus, ManagedUser, WeddingRole } from '@/types/domain';

type UserStatusFilter = 'all' | 'active' | 'deactivated' | InvitationStatus;

type PermissionStore = {
  users: ManagedUser[];
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
  updateRole: (weddingId: string, membershipId: string, role: WeddingRole) => Promise<void>;
  updatePermissions: (weddingId: string, membershipId: string, role: WeddingRole) => Promise<void>;
  deactivateUser: (weddingId: string, userId: string) => Promise<void>;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const usePermissionStore = create<PermissionStore>((set) => ({
  users: [],
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
      set({ users: await getUsers(weddingId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Users could not be loaded.'), loading: false });
    }
  },
  updateRole: async (weddingId, membershipId, role) => {
    set({ saving: true, error: null });
    try {
      await updateRole(membershipId, role);
      set({ users: await getUsers(weddingId), saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Role could not be updated.'), saving: false });
      throw error;
    }
  },
  updatePermissions: async (weddingId, membershipId, role) => {
    set({ saving: true, error: null });
    try {
      await updatePermissions(membershipId, role);
      set({ users: await getUsers(weddingId), saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Permissions could not be updated.'), saving: false });
      throw error;
    }
  },
  deactivateUser: async (weddingId, userId) => {
    set({ saving: true, error: null });
    try {
      await deactivateUser(userId);
      set({ users: await getUsers(weddingId), saving: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'User could not be deactivated.'), saving: false });
      throw error;
    }
  },
}));
