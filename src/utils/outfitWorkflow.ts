import type { OutfitStatus } from '@/types/domain';

export const outfitStatuses: OutfitStatus[] = [
  'idea',
  'shortlisted',
  'ordered',
  'received',
  'altered',
  'ready',
  'dropped',
];

export const outfitStatusLabels: Record<OutfitStatus, string> = {
  idea: 'Idea',
  shortlisted: 'Shortlisted',
  ordered: 'Ordered',
  received: 'Received',
  altered: 'Altered',
  ready: 'Ready',
  dropped: 'Dropped',
};

const transitions: Record<OutfitStatus, OutfitStatus[]> = {
  idea: ['shortlisted', 'dropped'],
  shortlisted: ['ordered', 'dropped'],
  ordered: ['received', 'dropped'],
  received: ['altered', 'ready', 'dropped'],
  altered: ['ready', 'dropped'],
  ready: [],
  dropped: [],
};

export function getAllowedOutfitStatuses(current?: OutfitStatus): OutfitStatus[] {
  if (!current) return ['idea', 'shortlisted'];
  return [current, ...transitions[current]];
}

export function canTransitionOutfitStatus(from: OutfitStatus, to: OutfitStatus): boolean {
  return from === to || transitions[from].includes(to);
}

export function isProgressOutfitStatus(status: OutfitStatus): boolean {
  return status !== 'dropped';
}
