import { create } from 'zustand';
import {
  addParticipant,
  archiveParticipant,
  getParticipantCandidates,
  getParticipants,
  updateParticipant,
} from '@/services/participant.service';
import type {
  Participant,
  ParticipantCandidate,
  ParticipantInput,
  ParticipantUpdateInput,
} from '@/types/domain';

type ParticipantStore = {
  participants: Participant[];
  candidates: ParticipantCandidate[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  search: string;
  setSearch: (search: string) => void;
  loadParticipants: (eventId: string, weddingId: string) => Promise<void>;
  loadCandidates: (eventId: string, weddingId: string) => Promise<void>;
  addParticipant: (input: ParticipantInput) => Promise<void>;
  updateParticipant: (participantId: string, input: ParticipantUpdateInput) => Promise<void>;
  archiveParticipant: (participantId: string) => Promise<void>;
  resetParticipants: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useParticipantStore = create<ParticipantStore>((set, get) => ({
  participants: [],
  candidates: [],
  loading: false,
  saving: false,
  error: null,
  search: '',
  setSearch: (search) => set({ search }),
  loadParticipants: async (eventId, weddingId) => {
    set({ loading: true, error: null });
    try {
      set({ participants: await getParticipants(eventId, weddingId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Participants could not be loaded.'), loading: false });
    }
  },
  loadCandidates: async (eventId, weddingId) => {
    try {
      set({ candidates: await getParticipantCandidates(weddingId, eventId), error: null });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Wedding members could not be loaded.') });
    }
  },
  addParticipant: async (input) => {
    set({ saving: true, error: null });
    try {
      const participant = await addParticipant(input);
      set((state) => ({
        participants: [participant, ...state.participants],
        candidates: state.candidates.map((candidate) =>
          candidate.userId === input.userId ? { ...candidate, isAlreadyParticipant: true } : candidate,
        ),
        saving: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error, 'Participant could not be added.'), saving: false });
      throw error;
    }
  },
  updateParticipant: async (participantId, input) => {
    const previousParticipants = get().participants;
    set((state) => ({
      saving: true,
      error: null,
      participants: state.participants.map((participant) =>
        participant.id === participantId
          ? { ...participant, roleInEvent: input.roleInEvent }
          : participant,
      ),
    }));
    try {
      const participant = await updateParticipant(participantId, input);
      set((state) => ({
        participants: state.participants.map((item) => (item.id === participantId ? participant : item)),
        saving: false,
      }));
    } catch (error) {
      set({
        participants: previousParticipants,
        error: getErrorMessage(error, 'Participant could not be updated.'),
        saving: false,
      });
      throw error;
    }
  },
  archiveParticipant: async (participantId) => {
    const previousParticipants = get().participants;
    set((state) => ({
      saving: true,
      error: null,
      participants: state.participants.filter((participant) => participant.id !== participantId),
    }));
    try {
      await archiveParticipant(participantId);
      set({ saving: false });
    } catch (error) {
      set({
        participants: previousParticipants,
        error: getErrorMessage(error, 'Participant could not be removed.'),
        saving: false,
      });
      throw error;
    }
  },
  resetParticipants: () => set({ participants: [], candidates: [], search: '', error: null }),
}));
