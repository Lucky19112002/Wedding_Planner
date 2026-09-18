import { create } from 'zustand';
import { listMemberships } from '@/services/membership.service';
import { listAccessibleWeddings } from '@/services/wedding.service';
import type { Membership, Wedding } from '@/types/domain';

const activeWeddingStorageKey = 'wedding-planner.activeWeddingId';

type WeddingStore = {
  weddings: Wedding[];
  memberships: Membership[];
  activeWeddingId: string | null;
  status: 'idle' | 'loading' | 'ready' | 'error';
  error: string | null;
  activeWedding: Wedding | null;
  activeMembership: Membership | null;
  setActiveWeddingId: (activeWeddingId: string | null) => void;
  loadWeddingContext: (userId: string) => Promise<void>;
  clearWeddingContext: () => void;
};

export const useWeddingStore = create<WeddingStore>((set) => ({
  weddings: [],
  memberships: [],
  activeWeddingId: null,
  status: 'idle',
  error: null,
  activeWedding: null,
  activeMembership: null,
  setActiveWeddingId: (activeWeddingId) => {
    if (activeWeddingId) {
      localStorage.setItem(activeWeddingStorageKey, activeWeddingId);
    } else {
      localStorage.removeItem(activeWeddingStorageKey);
    }

    set((state) => ({
      activeWeddingId,
      activeWedding: state.weddings.find((wedding) => wedding.id === activeWeddingId) ?? null,
      activeMembership:
        state.memberships.find((membership) => membership.weddingId === activeWeddingId) ?? null,
    }));
  },
  loadWeddingContext: async (userId) => {
    set({ status: 'loading', error: null });
    try {
      const [weddings, memberships] = await Promise.all([
        listAccessibleWeddings(),
        listMemberships(userId),
      ]);
      const storedWeddingId = localStorage.getItem(activeWeddingStorageKey);
      const selectedWedding =
        weddings.find((wedding) => wedding.id === storedWeddingId) ?? weddings.at(0) ?? null;
      const activeWeddingId = selectedWedding?.id ?? null;

      if (activeWeddingId) {
        localStorage.setItem(activeWeddingStorageKey, activeWeddingId);
      } else {
        localStorage.removeItem(activeWeddingStorageKey);
      }

      set({
        weddings,
        memberships,
        activeWeddingId,
        activeWedding: selectedWedding,
        activeMembership:
          memberships.find((membership) => membership.weddingId === activeWeddingId) ?? null,
        status: 'ready',
        error: null,
      });
    } catch (error) {
      set({
        weddings: [],
        memberships: [],
        activeWeddingId: null,
        activeWedding: null,
        activeMembership: null,
        status: 'error',
        error: error instanceof Error ? error.message : 'Wedding context could not be loaded.',
      });
    }
  },
  clearWeddingContext: () => {
    localStorage.removeItem(activeWeddingStorageKey);
    set({
      weddings: [],
      memberships: [],
      activeWeddingId: null,
      activeWedding: null,
      activeMembership: null,
      status: 'idle',
      error: null,
    });
  },
}));
