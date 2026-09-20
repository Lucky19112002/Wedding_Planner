import { create } from 'zustand';
import {
  archiveOutfit,
  createOutfit,
  getOutfit,
  getOutfits,
  switchOutfitParticipant,
  updateOutfit,
} from '@/services/outfit.service';
import type { Outfit, OutfitInput, OutfitStatus } from '@/types/domain';

type OutfitStore = {
  outfits: Outfit[];
  selectedOutfit: Outfit | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  filters: {
    status: OutfitStatus | 'all';
  };
  setStatusFilter: (status: OutfitStatus | 'all') => void;
  loadOutfits: (participantId: string) => Promise<void>;
  loadOutfit: (outfitId: string) => Promise<void>;
  createOutfit: (input: OutfitInput) => Promise<Outfit>;
  updateOutfit: (outfitId: string, input: OutfitInput) => Promise<Outfit>;
  switchOutfitParticipant: (outfitId: string, participantId: string) => Promise<Outfit>;
  archiveOutfit: (outfitId: string) => Promise<void>;
  resetOutfits: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useOutfitStore = create<OutfitStore>((set, get) => ({
  outfits: [],
  selectedOutfit: null,
  loading: false,
  saving: false,
  error: null,
  filters: { status: 'all' },
  setStatusFilter: (status) => set({ filters: { status } }),
  loadOutfits: async (participantId) => {
    set({ loading: true, error: null });
    try {
      set({ outfits: await getOutfits(participantId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Outfits could not be loaded.'), loading: false });
    }
  },
  loadOutfit: async (outfitId) => {
    set({ loading: true, error: null });
    try {
      set({ selectedOutfit: await getOutfit(outfitId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Outfit could not be loaded.'), loading: false });
    }
  },
  createOutfit: async (input) => {
    set({ saving: true, error: null });
    try {
      const outfit = await createOutfit(input);
      set((state) => ({ outfits: [outfit, ...state.outfits], saving: false }));
      return outfit;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Outfit could not be created.'), saving: false });
      throw error;
    }
  },
  updateOutfit: async (outfitId, input) => {
    const previousOutfits = get().outfits;
    const previousSelected = get().selectedOutfit;
    set((state) => ({
      saving: true,
      error: null,
      outfits: state.outfits.map((outfit) =>
        outfit.id === outfitId
          ? { ...outfit, ...input, dressType: input.dressType, colour: input.colour }
          : outfit,
      ),
      selectedOutfit:
        state.selectedOutfit?.id === outfitId
          ? { ...state.selectedOutfit, ...input, dressType: input.dressType, colour: input.colour }
          : state.selectedOutfit,
    }));
    try {
      const outfit = await updateOutfit(outfitId, input);
      set((state) => ({
        outfits: state.outfits.map((item) => (item.id === outfitId ? outfit : item)),
        selectedOutfit: state.selectedOutfit?.id === outfitId ? outfit : state.selectedOutfit,
        saving: false,
      }));
      return outfit;
    } catch (error) {
      set({
        outfits: previousOutfits,
        selectedOutfit: previousSelected,
        error: getErrorMessage(error, 'Outfit could not be updated.'),
        saving: false,
      });
      throw error;
    }
  },
  switchOutfitParticipant: async (outfitId, participantId) => {
    set({ saving: true, error: null });
    try {
      const outfit = await switchOutfitParticipant(outfitId, participantId);
      set((state) => ({
        outfits: state.outfits.map((item) => (item.id === outfitId ? outfit : item)),
        selectedOutfit: state.selectedOutfit?.id === outfitId ? outfit : state.selectedOutfit,
        saving: false,
      }));
      return outfit;
    } catch (error) {
      set({ error: getErrorMessage(error, 'Outfit owner could not be changed.'), saving: false });
      throw error;
    }
  },
  archiveOutfit: async (outfitId) => {
    const previousOutfits = get().outfits;
    set((state) => ({
      saving: true,
      error: null,
      outfits: state.outfits.filter((outfit) => outfit.id !== outfitId),
    }));
    try {
      await archiveOutfit(outfitId);
      set({ selectedOutfit: null, saving: false });
    } catch (error) {
      set({
        outfits: previousOutfits,
        error: getErrorMessage(error, 'Outfit could not be archived.'),
        saving: false,
      });
      throw error;
    }
  },
  resetOutfits: () => set({ outfits: [], selectedOutfit: null, error: null, filters: { status: 'all' } }),
}));
