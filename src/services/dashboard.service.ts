import { supabase } from '@/lib/supabase';
import type {
  DashboardData,
  DashboardEventProgress,
  DashboardOutfitAnalytics,
  DashboardParticipantInsight,
  DashboardTimelineEvent,
  EventStatus,
  OutfitStatus,
} from '@/types/domain';
import { getDaysRemaining, isPendingOutfitStatus } from '@/utils/dashboardMetrics';
import { outfitStatuses } from '@/utils/outfitWorkflow';

type WeddingProgressRow = {
  overall_completion_pct: number | string | null;
};

type EventRow = {
  id: string;
  name: string;
  event_date: string | null;
  location: string | null;
  status: EventStatus;
};

type EventProgressRow = {
  event_id: string;
  progress_pct: number | string | null;
};

type ParticipantRow = {
  id: string;
  event_id: string;
  user_id: string | null;
};

type ParticipantProgressRow = {
  participant_id: string;
  progress_pct: number | string | null;
};

type ProfileRow = {
  id: string;
  display_name: string;
  email: string;
  relationship_note: string | null;
};

type OutfitRow = {
  participant_id: string;
  event_id: string;
  status: OutfitStatus;
};

type MembershipRow = {
  user_id: string;
};

type InvitationRow = {
  id: string;
};

function toNumber(value: number | string | null | undefined): number {
  if (value == null) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function countBy<T extends string>(values: T[]): Map<T, number> {
  return values.reduce((counts, value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
    return counts;
  }, new Map<T, number>());
}

function getInitialAnalytics(): DashboardOutfitAnalytics {
  return outfitStatuses.reduce((analytics, status) => ({ ...analytics, [status]: 0 }), {} as DashboardOutfitAnalytics);
}

function buildTimeline(events: EventRow[]): DashboardTimelineEvent[] {
  const today = new Date();
  return events
    .filter((event) => event.event_date && event.status !== 'cancelled')
    .map((event) => ({
      daysRemaining: getDaysRemaining(event.event_date as string, today),
      eventDate: event.event_date as string,
      eventId: event.id,
      location: event.location,
      name: event.name,
      status: event.status,
    }))
    .filter((event) => event.daysRemaining >= 0)
    .sort((left, right) => left.daysRemaining - right.daysRemaining)
    .slice(0, 5);
}

function buildEventProgress(
  events: EventRow[],
  eventProgressRows: EventProgressRow[],
  participants: ParticipantRow[],
  outfits: OutfitRow[],
): DashboardEventProgress[] {
  const progressByEvent = new Map(eventProgressRows.map((row) => [row.event_id, toNumber(row.progress_pct)]));
  const participantCounts = countBy(participants.map((participant) => participant.event_id));
  const readyOutfitCounts = countBy(
    outfits.filter((outfit) => outfit.status === 'ready').map((outfit) => outfit.event_id),
  );

  return events.map((event) => ({
    eventDate: event.event_date,
    eventId: event.id,
    location: event.location,
    name: event.name,
    participantCount: participantCounts.get(event.id) ?? 0,
    progressPct: progressByEvent.get(event.id) ?? 0,
    readyOutfitCount: readyOutfitCounts.get(event.id) ?? 0,
    status: event.status,
  }));
}

function buildParticipantInsights(
  participants: ParticipantRow[],
  participantProgressRows: ParticipantProgressRow[],
  profiles: ProfileRow[],
  outfits: OutfitRow[],
): DashboardParticipantInsight[] {
  const progressByParticipant = new Map(
    participantProgressRows.map((row) => [row.participant_id, toNumber(row.progress_pct)]),
  );
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const outfitRowsByParticipant = new Map<string, OutfitRow[]>();
  for (const outfit of outfits) {
    outfitRowsByParticipant.set(outfit.participant_id, [
      ...(outfitRowsByParticipant.get(outfit.participant_id) ?? []),
      outfit,
    ]);
  }

  return participants
    .map((participant) => {
      const profile = participant.user_id ? profilesById.get(participant.user_id) : undefined;
      const participantOutfits = outfitRowsByParticipant.get(participant.id) ?? [];
      return {
        displayName: profile?.display_name ?? 'Former user',
        email: profile?.email ?? null,
        eventId: participant.event_id,
        participantId: participant.id,
        pendingOutfits: participantOutfits.filter((outfit) => isPendingOutfitStatus(outfit.status)).length,
        progressPct: progressByParticipant.get(participant.id) ?? 0,
        readyOutfits: participantOutfits.filter((outfit) => outfit.status === 'ready').length,
        relationshipNote: profile?.relationship_note ?? null,
      };
    })
    .sort((left, right) => left.progressPct - right.progressPct)
    .slice(0, 5);
}

export async function getDashboardData(weddingId: string): Promise<DashboardData> {
  const [
    weddingProgressResult,
    eventsResult,
    eventProgressResult,
    participantsResult,
    participantProgressResult,
    outfitsResult,
    invitationsResult,
    membershipsResult,
  ] = await Promise.all([
    supabase
      .from('v_wedding_progress')
      .select('overall_completion_pct')
      .eq('wedding_id', weddingId)
      .maybeSingle<WeddingProgressRow>(),
    supabase
      .from('events')
      .select('id,name,event_date,location,status')
      .eq('wedding_id', weddingId)
      .is('archived_at', null)
      .order('event_date', { ascending: true, nullsFirst: false }),
    supabase
      .from('v_event_progress')
      .select('event_id,progress_pct')
      .eq('wedding_id', weddingId),
    supabase
      .from('participants')
      .select('id,event_id,user_id')
      .eq('wedding_id', weddingId)
      .is('archived_at', null),
    supabase
      .from('v_participant_progress')
      .select('participant_id,progress_pct')
      .eq('wedding_id', weddingId),
    supabase
      .from('outfits')
      .select('participant_id,event_id,status')
      .eq('wedding_id', weddingId)
      .is('archived_at', null),
    supabase
      .from('invitations')
      .select('id')
      .eq('wedding_id', weddingId)
      .eq('status', 'pending')
      .is('archived_at', null),
    supabase
      .from('wedding_memberships')
      .select('user_id')
      .eq('wedding_id', weddingId)
      .is('archived_at', null),
  ]);

  if (weddingProgressResult.error) throw weddingProgressResult.error;
  if (eventsResult.error) throw eventsResult.error;
  if (eventProgressResult.error) throw eventProgressResult.error;
  if (participantsResult.error) throw participantsResult.error;
  if (participantProgressResult.error) throw participantProgressResult.error;
  if (outfitsResult.error) throw outfitsResult.error;
  if (invitationsResult.error) throw invitationsResult.error;
  if (membershipsResult.error) throw membershipsResult.error;

  const events = (eventsResult.data ?? []) as EventRow[];
  const participants = (participantsResult.data ?? []) as ParticipantRow[];
  const outfits = (outfitsResult.data ?? []) as OutfitRow[];
  const todayTasks =
    events.filter((event) => event.event_date && getDaysRemaining(event.event_date) === 0).length +
    outfits.filter((outfit) => isPendingOutfitStatus(outfit.status)).length +
    ((invitationsResult.data ?? []) as InvitationRow[]).length;
  const userIds = participants.flatMap((participant) => (participant.user_id ? [participant.user_id] : []));
  const profilesResult =
    userIds.length > 0
      ? await supabase
          .from('profiles')
          .select('id,display_name,email,relationship_note')
          .in('id', userIds)
      : { data: [], error: null };
  if (profilesResult.error) throw profilesResult.error;

  const analytics = getInitialAnalytics();
  for (const outfit of outfits) analytics[outfit.status] += 1;

  const readyOutfits = outfits.filter((outfit) => outfit.status === 'ready').length;
  const pendingOutfits = outfits.filter((outfit) => isPendingOutfitStatus(outfit.status)).length;
  const upcomingEvents = events.filter(
    (event) => event.event_date && event.status !== 'cancelled' && getDaysRemaining(event.event_date) >= 0,
  ).length;

  return {
    eventProgress: buildEventProgress(
      events,
      (eventProgressResult.data ?? []) as EventProgressRow[],
      participants,
      outfits,
    ),
    outfitAnalytics: analytics,
    participantInsights: buildParticipantInsights(
      participants,
      (participantProgressResult.data ?? []) as ParticipantProgressRow[],
      (profilesResult.data ?? []) as ProfileRow[],
      outfits,
    ),
    summary: {
      completedEvents: events.filter((event) => event.status === 'completed').length,
      familyMembers: new Set(((membershipsResult.data ?? []) as MembershipRow[]).map((row) => row.user_id)).size,
      overallCompletionPct: toNumber(weddingProgressResult.data?.overall_completion_pct),
      pendingOutfits,
      pendingInvitations: ((invitationsResult.data ?? []) as InvitationRow[]).length,
      readyOutfits,
      todaysTasks: todayTasks,
      totalEvents: events.length,
      totalOutfits: outfits.length,
      totalParticipants: participants.length,
      upcomingEvents,
    },
    timeline: buildTimeline(events),
  };
}
