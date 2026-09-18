import { describe, expect, it } from 'vitest';
import {
  clampProgress,
  formatDaysRemaining,
  getDaysRemaining,
  getReadinessLabel,
  isPendingOutfitStatus,
} from '@/utils/dashboardMetrics';

describe('dashboardMetrics', () => {
  it('labels readiness from the progress percentage', () => {
    expect(getReadinessLabel(0)).toBe('Planning');
    expect(getReadinessLabel(25)).toBe('In Progress');
    expect(getReadinessLabel(75)).toBe('Nearly Ready');
    expect(getReadinessLabel(100)).toBe('Wedding Ready');
  });

  it('clamps displayed progress to a whole 0-100 range', () => {
    expect(clampProgress(-2)).toBe(0);
    expect(clampProgress(42.4)).toBe(42);
    expect(clampProgress(100.9)).toBe(100);
  });

  it('formats upcoming timeline day labels', () => {
    expect(getDaysRemaining('2026-09-18', new Date('2026-09-18T18:00:00'))).toBe(0);
    expect(formatDaysRemaining(0)).toBe('Today');
    expect(formatDaysRemaining(1)).toBe('Tomorrow');
    expect(formatDaysRemaining(7)).toBe('7 days');
  });

  it('counts dropped outfits outside pending work', () => {
    expect(isPendingOutfitStatus('idea')).toBe(true);
    expect(isPendingOutfitStatus('ordered')).toBe(true);
    expect(isPendingOutfitStatus('ready')).toBe(false);
    expect(isPendingOutfitStatus('dropped')).toBe(false);
  });
});
