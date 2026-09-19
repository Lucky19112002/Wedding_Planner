import type { OutfitStatus } from '@/types/domain';

export function getReadinessLabel(progress: number): string {
  if (progress >= 100) return 'Wedding Ready';
  if (progress >= 75) return 'Nearly Ready';
  if (progress >= 25) return 'In Progress';
  return 'Planning';
}

export function clampProgress(progress: number): number {
  return Math.max(0, Math.min(100, Math.round(progress)));
}

export function getDaysRemaining(eventDate: string, today = new Date()): number {
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const eventStart = new Date(`${eventDate}T00:00:00`).getTime();
  return Math.round((eventStart - todayStart) / 86_400_000);
}

export function formatDaysRemaining(days: number): string {
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 0) return `${Math.abs(days)} days ago`;
  return `${days} days`;
}

export function isPendingOutfitStatus(status: OutfitStatus): boolean {
  return status !== 'ready' && status !== 'dropped';
}
