import { describe, expect, it } from 'vitest';
import {
  canTransitionOutfitStatus,
  getAllowedOutfitStatuses,
  isProgressOutfitStatus,
} from '@/utils/outfitWorkflow';

describe('outfit workflow', () => {
  it('starts new outfits as idea or shortlisted only', () => {
    expect(getAllowedOutfitStatuses()).toEqual(['idea', 'shortlisted']);
  });

  it('prevents leaving ready once final', () => {
    expect(getAllowedOutfitStatuses('ready')).toEqual(['ready']);
    expect(canTransitionOutfitStatus('ready', 'altered')).toBe(false);
  });

  it('excludes dropped outfits from progress', () => {
    expect(isProgressOutfitStatus('dropped')).toBe(false);
    expect(isProgressOutfitStatus('ordered')).toBe(true);
  });
});
