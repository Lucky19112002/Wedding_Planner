import { supabase } from '@/lib/supabase';
import type { Event, EventInput, EventStatus } from '@/types/domain';

type EventRow = {
  id: string;
  wedding_id: string;
  name: string;
  event_date: string | null;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  notes: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  archived_at: string | null;
};

type ParticipantRow = {
  event_id: string;
};

type OutfitRow = {
  event_id: string;
};

function mapEvent(row: EventRow, participantCount = 0, outfitCount = 0): Event {
  return {
    id: row.id,
    weddingId: row.wedding_id,
    name: row.name,
    eventDate: row.event_date,
    startTime: row.start_time?.slice(0, 5) ?? null,
    endTime: row.end_time?.slice(0, 5) ?? null,
    location: row.location,
    notes: row.notes,
    status: row.status,
    participantCount,
    outfitCount,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    archivedAt: row.archived_at,
  };
}

function toRow(input: EventInput) {
  return {
    wedding_id: input.weddingId,
    name: input.name,
    event_date: input.eventDate,
    start_time: input.startTime,
    end_time: input.endTime,
    location: input.location,
    notes: input.notes,
    status: input.status,
  };
}

function countByEvent<T extends { event_id: string }>(rows: T[]): Map<string, number> {
  return rows.reduce((counts, row) => {
    counts.set(row.event_id, (counts.get(row.event_id) ?? 0) + 1);
    return counts;
  }, new Map<string, number>());
}

async function getParticipantCounts(weddingId: string): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('participants')
    .select('event_id')
    .eq('wedding_id', weddingId)
    .is('archived_at', null);

  if (error) throw error;

  return countByEvent((data ?? []) as ParticipantRow[]);
}

async function getOutfitCounts(weddingId: string): Promise<Map<string, number>> {
  const { data, error } = await supabase
    .from('outfits')
    .select('event_id')
    .eq('wedding_id', weddingId)
    .is('archived_at', null);

  if (error) throw error;
  return countByEvent((data ?? []) as OutfitRow[]);
}

export async function getEvents(weddingId: string): Promise<Event[]> {
  const [{ data, error }, participantCounts, outfitCounts] = await Promise.all([
    supabase
      .from('events')
      .select('id,wedding_id,name,event_date,start_time,end_time,location,notes,status,created_at,updated_at,archived_at')
      .eq('wedding_id', weddingId)
      .is('archived_at', null)
      .order('event_date', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
    getParticipantCounts(weddingId),
    getOutfitCounts(weddingId),
  ]);

  if (error) throw error;
  return (data ?? []).map((row) => {
    const event = row as EventRow;
    return mapEvent(event, participantCounts.get(event.id), outfitCounts.get(event.id));
  });
}

export async function getEvent(eventId: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('events')
    .select('id,wedding_id,name,event_date,start_time,end_time,location,notes,status,created_at,updated_at,archived_at')
    .eq('id', eventId)
    .is('archived_at', null)
    .maybeSingle<EventRow>();

  if (error) throw error;
  if (!data) return null;

  const [participantCounts, outfitCounts] = await Promise.all([
    getParticipantCounts(data.wedding_id),
    getOutfitCounts(data.wedding_id),
  ]);
  return mapEvent(data, participantCounts.get(data.id), outfitCounts.get(data.id));
}

export async function createEvent(input: EventInput): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .insert(toRow(input))
    .select('id,wedding_id,name,event_date,start_time,end_time,location,notes,status,created_at,updated_at,archived_at')
    .single<EventRow>();

  if (error) throw error;
  return mapEvent(data);
}

export async function updateEvent(eventId: string, input: EventInput): Promise<Event> {
  const { data, error } = await supabase
    .from('events')
    .update(toRow(input))
    .eq('id', eventId)
    .select('id,wedding_id,name,event_date,start_time,end_time,location,notes,status,created_at,updated_at,archived_at')
    .single<EventRow>();

  if (error) throw error;
  const [participantCounts, outfitCounts] = await Promise.all([
    getParticipantCounts(input.weddingId),
    getOutfitCounts(input.weddingId),
  ]);
  return mapEvent(data, participantCounts.get(data.id), outfitCounts.get(data.id));
}

export async function archiveEvent(eventId: string): Promise<void> {
  const { error } = await supabase.rpc('archive_event', { p_event_id: eventId });
  if (error) throw error;
}
