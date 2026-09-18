import { describe, expect, it } from 'vitest';
import { getAvailableCandidates, isDuplicateParticipant } from '@/utils/participantValidation';
import type { Participant, ParticipantCandidate } from '@/types/domain';

const participant: Participant = {
  id: 'participant-1',
  eventId: 'event-1',
  weddingId: 'wedding-1',
  userId: 'user-1',
  displayName: 'Lucky',
  email: 'lucky@example.com',
  relationshipNote: 'Groom',
  roleInEvent: 'Groom',
  memberRole: 'admin',
  outfitCount: 0,
  createdAt: '2026-09-18T00:00:00Z',
  updatedAt: '2026-09-18T00:00:00Z',
  archivedAt: null,
};

const candidates: ParticipantCandidate[] = [
  {
    userId: 'user-1',
    displayName: 'Lucky',
    email: 'lucky@example.com',
    relationshipNote: 'Groom',
    memberRole: 'admin',
    isAlreadyParticipant: true,
  },
  {
    userId: 'user-2',
    displayName: 'Kareena',
    email: 'kareena@example.com',
    relationshipNote: 'Bride',
    memberRole: 'member',
    isAlreadyParticipant: false,
  },
];

describe('participant validation', () => {
  it('detects active duplicate participants', () => {
    expect(isDuplicateParticipant('user-1', [participant])).toBe(true);
  });

  it('ignores archived participants when checking duplicates', () => {
    expect(isDuplicateParticipant('user-1', [{ ...participant, archivedAt: '2026-09-18T01:00:00Z' }])).toBe(false);
  });

  it('filters out existing participants and searches wedding members', () => {
    expect(getAvailableCandidates(candidates, 'bride')).toEqual([candidates[1]]);
  });
});
