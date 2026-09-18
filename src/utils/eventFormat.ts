import type { Event } from '@/types/domain';

export function formatEventDate(date: string | null): string {
  if (!date) return 'Date not set';
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`));
}

export function formatEventTime(event: Pick<Event, 'startTime' | 'endTime'>): string {
  if (!event.startTime && !event.endTime) return 'Time not set';
  if (event.startTime && event.endTime) return `${event.startTime} - ${event.endTime}`;
  return event.startTime ?? event.endTime ?? 'Time not set';
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}
