import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import { Select } from '@/components/ui/Select';
import {
  DeactivateUserDialog,
  InviteUserDialog,
  PendingInvitationsSection,
  UserCard,
  UserEmptyState,
} from '@/components/users';
import { usePermission } from '@/hooks/usePermission';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { useInvitationStore } from '@/store/invitationStore';
import { usePermissionStore } from '@/store/permissionStore';
import type { Invitation, InvitationInput, ManagedUser, WeddingRole } from '@/types/domain';
import { weddingRoleLabels } from '@/utils/permissions';

export function UsersPage() {
  const [isInviteOpen, setInviteOpen] = useState(false);
  const [deactivationTarget, setDeactivationTarget] = useState<ManagedUser | null>(null);
  const { activeMembership, activeWeddingId, weddings } = useWeddingContext();
  const canManageUsers = usePermission('users', 'create');
  const users = usePermissionStore((state) => state.users);
  const loadingUsers = usePermissionStore((state) => state.loading);
  const savingUsers = usePermissionStore((state) => state.saving);
  const usersError = usePermissionStore((state) => state.error);
  const clearUserError = usePermissionStore((state) => state.clearError);
  const loadUsers = usePermissionStore((state) => state.loadUsers);
  const updatePermissions = usePermissionStore((state) => state.updatePermissions);
  const deactivateUser = usePermissionStore((state) => state.deactivateUser);
  const search = usePermissionStore((state) => state.search);
  const setSearch = usePermissionStore((state) => state.setSearch);
  const roleFilter = usePermissionStore((state) => state.roleFilter);
  const setRoleFilter = usePermissionStore((state) => state.setRoleFilter);
  const statusFilter = usePermissionStore((state) => state.statusFilter);
  const setStatusFilter = usePermissionStore((state) => state.setStatusFilter);
  const pendingInvitations = useInvitationStore((state) => state.pendingInvitations);
  const inviteError = useInvitationStore((state) => state.error);
  const lastInviteUrl = useInvitationStore((state) => state.lastInviteUrl);
  const savingInvites = useInvitationStore((state) => state.saving);
  const clearInviteUrl = useInvitationStore((state) => state.clearInviteUrl);
  const loadPendingInvitations = useInvitationStore((state) => state.loadPendingInvitations);
  const sendInvitation = useInvitationStore((state) => state.sendInvitation);
  const resendInvitation = useInvitationStore((state) => state.resendInvitation);
  const cancelInvitation = useInvitationStore((state) => state.cancelInvitation);

  useEffect(() => {
    if (!activeWeddingId) return;
    void loadUsers(activeWeddingId);
    void loadPendingInvitations(activeWeddingId);
  }, [activeWeddingId, loadPendingInvitations, loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.displayName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);
      const matchesRole = roleFilter === 'all' || user.weddingRole === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !user.isDeactivated) ||
        (statusFilter === 'deactivated' && user.isDeactivated) ||
        user.invitationStatus === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, search, statusFilter, users]);
  const hasFilters = Boolean(search.trim()) || roleFilter !== 'all' || statusFilter !== 'all';

  async function handleInvite(input: InvitationInput) {
    try {
      const result = await sendInvitation(input);
      setInviteOpen(false);
      if (result.existingUser) {
        await loadUsers(input.weddingId);
      }
    } catch {
      // Store error is rendered above the form.
    }
  }

  async function handleCopyInvite() {
    if (!lastInviteUrl) return;
    await navigator.clipboard.writeText(lastInviteUrl);
  }

  async function handleRoleChange(user: ManagedUser, role: WeddingRole) {
    if (!activeWeddingId) return;
    try {
      await updatePermissions(activeWeddingId, user.membershipId, role);
    } catch {
      // Store error is rendered on the page.
    }
  }

  async function handleResend(invitation: Invitation) {
    if (!activeWeddingId) return;
    try {
      await resendInvitation(invitation.id, activeWeddingId);
    } catch {
      // Store error is rendered on the page.
    }
  }

  async function handleCancel(invitation: Invitation) {
    if (!activeWeddingId) return;
    try {
      await cancelInvitation(invitation.id, activeWeddingId);
    } catch {
      // Store error is rendered on the page.
    }
  }

  async function handleDeactivate() {
    if (!activeWeddingId || !deactivationTarget) return;
    try {
      await deactivateUser(activeWeddingId, deactivationTarget.userId);
      setDeactivationTarget(null);
    } catch {
      // Store error is rendered on the page.
    }
  }

  if (!activeWeddingId || !activeMembership) {
    return <ErrorState message="Select an active wedding before managing users." />;
  }

  if (loadingUsers && users.length === 0) return <Loader label="Loading users" />;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-700">Invitation & Permission Management</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Users</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Invite family members, manage wedding roles, and review role-derived permissions.
          </p>
        </div>
        {canManageUsers ? (
          <Button
            type="button"
            onClick={() => {
              clearUserError();
              setInviteOpen(true);
            }}
          >
            Invite user
          </Button>
        ) : null}
      </section>

      {usersError || inviteError ? <ErrorState message={usersError ?? inviteError ?? ''} /> : null}

      {lastInviteUrl ? (
        <Card className="space-y-3 border-brand-100 bg-brand-50">
          <div>
            <h2 className="font-semibold text-brand-900">Invitation link ready</h2>
            <p className="mt-1 break-all text-sm text-brand-800">{lastInviteUrl}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" onClick={handleCopyInvite}>
              Copy link
            </Button>
            <Button type="button" variant="ghost" onClick={clearInviteUrl}>
              Dismiss
            </Button>
          </div>
        </Card>
      ) : null}

      <Card className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <Input
          aria-label="Search users"
          placeholder="Search by name or email"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select
          aria-label="Filter by role"
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value as WeddingRole | 'all')}
        >
          <option value="all">All roles</option>
          {(['admin', 'member', 'viewer'] as WeddingRole[]).map((role) => (
            <option key={role} value={role}>
              {weddingRoleLabels[role]}
            </option>
          ))}
        </Select>
        <Select
          aria-label="Filter by status"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as Parameters<typeof setStatusFilter>[0])}
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="deactivated">Deactivated</option>
          <option value="pending">Pending invite</option>
          <option value="expired">Expired invite</option>
        </Select>
      </Card>

      {filteredUsers.length === 0 ? (
        <UserEmptyState hasFilters={hasFilters} />
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.membershipId}
              canManage={canManageUsers}
              isSaving={savingUsers}
              user={user}
              onDeactivate={(target) => {
                clearUserError();
                setDeactivationTarget(target);
              }}
              onRoleChange={handleRoleChange}
            />
          ))}
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Pending invitations</h2>
        <PendingInvitationsSection
          invitations={pendingInvitations}
          isSaving={savingInvites}
          onCancel={handleCancel}
          onResend={handleResend}
        />
      </section>

      <InviteUserDialog
        activeWeddingId={activeWeddingId}
        isOpen={isInviteOpen}
        isSaving={savingInvites}
        weddings={weddings}
        onClose={() => setInviteOpen(false)}
        onSubmit={handleInvite}
      />
      <DeactivateUserDialog
        isOpen={Boolean(deactivationTarget)}
        isSaving={savingUsers}
        user={deactivationTarget}
        onClose={() => {
          clearUserError();
          setDeactivationTarget(null);
        }}
        onConfirm={() => void handleDeactivate()}
      />
    </div>
  );
}
