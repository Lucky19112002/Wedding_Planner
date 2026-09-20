import { NavLink, Outlet } from 'react-router-dom';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { usePermission } from '@/hooks/usePermission';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { useUiStore } from '@/store/uiStore';
import { cx } from '@/utils/cx';
import { getDisplayRole } from '@/utils/permissions';


export function AppLayout() {
  const { signOut } = useAuth();
  const { error: profileError, profile, status: profileStatus } = useProfile();
  const {
    activeMembership,
    activeWedding,
    activeWeddingId,
    error: weddingError,
    setActiveWeddingId,
    status: weddingStatus,
    weddings,
  } = useWeddingContext();
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);
  const toggleSidebar = useUiStore((state) => state.toggleSidebar);
  const displayName = profile?.displayName ?? 'User';
  const displayRole = getDisplayRole(profile, activeMembership);
  const canAdminEvents = usePermission('events', 'admin');
  const canAdminUsers = usePermission('users', 'admin');
  const navItems = [
    ...(canAdminEvents ? [{ label: 'Overview', to: '/app' }] : []),
    { label: 'Events', to: '/app/events' },
    { label: 'Clothing', to: '/app/clothing' },
    ...(canAdminUsers ? [{ label: 'Users', to: '/app/users' }] : []),
  ];

  if ((profileStatus === 'error' && profileError) || (weddingStatus === 'error' && weddingError)) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-10">
        <ErrorState message={profileError ?? weddingError ?? 'The workspace could not be loaded.'} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div
        className={cx(
          'fixed inset-0 z-20 bg-slate-950/40 md:hidden',
          isSidebarOpen ? 'block' : 'hidden',
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={cx(
          'fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="text-lg font-semibold">Wedding Planner</div>
          <p className="mt-1 text-sm text-slate-500">{activeWedding?.name ?? 'No wedding selected'}</p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              className={({ isActive }) =>
                cx(
                  'flex min-h-11 w-full items-center rounded-md px-3 text-left text-sm font-medium',
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100',
                )
              }
              end={item.to === '/app'}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <Avatar name={displayName} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="truncate text-xs text-slate-500">{profile?.email}</p>
            </div>
          </div>
          <Badge className="mt-3">{displayRole}</Badge>
          <Button className="mt-4 w-full" variant="secondary" onClick={() => void signOut()}>
            Log out
          </Button>
        </div>
      </aside>

      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white md:ml-72">
        <div className="flex min-h-16 items-center justify-between gap-3 px-4 md:px-6">
          <Button className="px-3 md:hidden" variant="ghost" onClick={toggleSidebar}>
            Menu
          </Button>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{activeWedding?.name ?? 'Wedding workspace'}</p>
            <p className="truncate text-xs text-slate-500">{displayRole}</p>
          </div>
          {weddings.length > 1 ? (
            <Select
              aria-label="Wedding"
              className="max-w-48 text-sm"
              value={activeWeddingId ?? ''}
              onChange={(event) => setActiveWeddingId(event.target.value)}
            >
              {weddings.map((wedding) => (
                <option key={wedding.id} value={wedding.id}>
                  {wedding.name}
                </option>
              ))}
            </Select>
          ) : null}
        </div>
      </header>

      <main className="px-4 py-6 md:ml-72 md:px-6">
        {weddings.length === 0 ? (
          <EmptyState
            title="No active weddings"
            description="Ask a wedding admin to add your account to a wedding."
          />
        ) : (
          <Outlet />
        )}
      </main>
    </div>
  );
}
