import { useEffect } from 'react';
import {
  DashboardSkeleton,
  EventProgressList,
  OutfitAnalytics,
  ParticipantInsights,
  ProgressRing,
  QuickActions,
  SummaryCard,
  UpcomingTimeline,
} from '@/components/dashboard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { useWeddingContext } from '@/hooks/useWeddingContext';
import { useDashboardStore } from '@/store/dashboardStore';
import { clampProgress } from '@/utils/dashboardMetrics';

export function AppHomePage() {
  const { activeWedding, activeWeddingId } = useWeddingContext();
  const dashboard = useDashboardStore((state) => state.dashboard);
  const error = useDashboardStore((state) => state.error);
  const loading = useDashboardStore((state) => state.loading);
  const refreshing = useDashboardStore((state) => state.refreshing);
  const loadDashboard = useDashboardStore((state) => state.loadDashboard);
  const refreshDashboard = useDashboardStore((state) => state.refreshDashboard);

  useEffect(() => {
    if (activeWeddingId) void loadDashboard(activeWeddingId);
  }, [activeWeddingId, loadDashboard]);

  if (loading && !dashboard) return <DashboardSkeleton />;
  if (error && !dashboard) return <ErrorState message={error} />;
  if (!dashboard) return <DashboardSkeleton />;

  const summary = dashboard.summary;

  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="transition duration-200 hover:shadow-md">
          <ProgressRing progress={summary.overallCompletionPct} />
        </Card>
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Wedding dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">{activeWedding?.name}</h1>
              <p className="mt-2 text-sm text-slate-600">
                {activeWedding?.coupleNames ?? 'Progress, events, outfits, and shopping readiness.'}
              </p>
            </div>
            <Button
              isLoading={refreshing}
              variant="secondary"
              onClick={() => activeWeddingId && void refreshDashboard(activeWeddingId)}
            >
              Refresh
            </Button>
          </div>
          {error ? <p className="mt-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700">{error}</p> : null}
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-brand-600"
              style={{ width: `${clampProgress(summary.overallCompletionPct)}%` }}
            />
          </div>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label="Wedding completion" value={`${clampProgress(summary.overallCompletionPct)}%`} />
        <SummaryCard label="Total events" value={summary.totalEvents} />
        <SummaryCard label="Upcoming events" value={summary.upcomingEvents} />
        <SummaryCard label="Completed events" value={summary.completedEvents} />
        <SummaryCard label="Total participants" value={summary.totalParticipants} />
        <SummaryCard label="Total outfits" value={summary.totalOutfits} />
        <SummaryCard label="Ready outfits" value={summary.readyOutfits} />
        <SummaryCard label="Pending outfits" value={summary.pendingOutfits} />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <EventProgressList events={dashboard.eventProgress} />
        <UpcomingTimeline events={dashboard.timeline} />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <ParticipantInsights participants={dashboard.participantInsights} />
        <OutfitAnalytics analytics={dashboard.outfitAnalytics} />
        <QuickActions />
      </section>
    </div>
  );
}
