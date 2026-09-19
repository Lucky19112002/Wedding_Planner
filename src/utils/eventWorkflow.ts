import type { EventStatus } from '@/types/domain';

export const eventStatuses: EventStatus[] = [
  'draft',
  'planned',
  'confirmed',
  'completed',
  'cancelled',
];

export const eventStatusLabels: Record<EventStatus, string> = {
  draft: 'Draft',
  planned: 'Planned',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const transitions: Record<EventStatus, EventStatus[]> = {
  draft: ['planned', 'cancelled'],
  planned: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: ['confirmed'],
  cancelled: ['draft', 'planned'],
};

export function canTransitionEventStatus(from: EventStatus, to: EventStatus): boolean {
  return from === to || transitions[from].includes(to);
}

export function getAllowedEventStatuses(current?: EventStatus): EventStatus[] {
  if (!current) return ['draft', 'planned'];
  return [current, ...transitions[current]];
}

export function isUpcomingEvent(eventDate: string | null, status: EventStatus): boolean {
  if (!eventDate || status === 'cancelled' || status === 'completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${eventDate}T00:00:00`).getTime() >= today.getTime();
}
