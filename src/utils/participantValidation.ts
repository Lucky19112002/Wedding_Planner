import type { Participant, ParticipantCandidate } from '@/types/domain';

export function isDuplicateParticipant(userId: string, participants: Participant[]): boolean {
  return participants.some((participant) => participant.userId === userId && !participant.archivedAt);
}

export function getAvailableCandidates(candidates: ParticipantCandidate[], search: string): ParticipantCandidate[] {
  const query = search.trim().toLowerCase();
  return candidates.filter((candidate) => {
    if (candidate.isAlreadyParticipant) return false;
    if (!query) return true;
    return (
      candidate.displayName.toLowerCase().includes(query) ||
      candidate.email.toLowerCase().includes(query) ||
      (candidate.relationshipNote?.toLowerCase().includes(query) ?? false)
    );
  });
}
