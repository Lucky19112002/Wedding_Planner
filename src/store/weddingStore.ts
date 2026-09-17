import { create } from 'zustand';

type WeddingStore = {
  activeWeddingId: string | null;
  setActiveWeddingId: (activeWeddingId: string | null) => void;
};

export const useWeddingStore = create<WeddingStore>((set) => ({
  activeWeddingId: null,
  setActiveWeddingId: (activeWeddingId) => set({ activeWeddingId }),
}));
