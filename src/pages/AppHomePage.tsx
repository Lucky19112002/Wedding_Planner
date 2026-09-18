import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { useProfile } from '@/hooks/useProfile';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { getDisplayRole } from '@/utils/permissions';

export function AppHomePage() {
  const { profile } = useProfile();
  const { activeMembership, activeWedding, memberships, weddings } = useWeddingContext();
  const displayRole = getDisplayRole(profile, activeMembership);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="flex items-start gap-4">
            <Avatar className="size-14 text-lg" name={profile?.displayName} />
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold">{profile?.displayName}</h1>
              <p className="mt-1 truncate text-sm text-slate-600">{profile?.email}</p>
              <Badge className="mt-3">{displayRole}</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Active wedding
          </h2>
          <p className="mt-3 text-xl font-semibold">{activeWedding?.name}</p>
          {activeWedding?.coupleNames ? (
            <p className="mt-1 text-sm text-slate-600">{activeWedding.coupleNames}</p>
          ) : null}
          {activeWedding?.weddingDate ? (
            <p className="mt-2 text-sm text-slate-500">{activeWedding.weddingDate}</p>
          ) : null}
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-sm text-slate-500">Available weddings</p>
          <p className="mt-2 text-3xl font-semibold">{weddings.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-slate-500">Active memberships</p>
          <p className="mt-2 text-3xl font-semibold">{memberships.length}</p>
        </Card>
      </section>
    </div>
  );
}
