import { create } from 'zustand';
import {
  createShoppingLink,
  deleteShoppingLink,
  getShoppingLinks,
  updateShoppingLink,
} from '@/services/shoppingLink.service';
import type { ShoppingLink, ShoppingLinkInput } from '@/types/domain';

type ShoppingLinkStore = {
  links: ShoppingLink[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadLinks: (outfitId: string) => Promise<void>;
  createLink: (input: ShoppingLinkInput) => Promise<void>;
  updateLink: (linkId: string, input: ShoppingLinkInput) => Promise<void>;
  deleteLink: (linkId: string) => Promise<void>;
  resetLinks: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useShoppingLinkStore = create<ShoppingLinkStore>((set, get) => ({
  links: [],
  loading: false,
  saving: false,
  error: null,
  loadLinks: async (outfitId) => {
    set({ loading: true, error: null });
    try {
      set({ links: await getShoppingLinks(outfitId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Shopping links could not be loaded.'), loading: false });
    }
  },
  createLink: async (input) => {
    set({ saving: true, error: null });
    try {
      const link = await createShoppingLink(input, get().links.length);
      set((state) => ({ links: [...state.links, link], saving: false }));
    } catch (error) {
      set({ error: getErrorMessage(error, 'Shopping link could not be saved.'), saving: false });
      throw error;
    }
  },
  updateLink: async (linkId, input) => {
    set({ saving: true, error: null });
    try {
      const link = await updateShoppingLink(linkId, input);
      set((state) => ({
        links: state.links.map((item) => (item.id === linkId ? link : item)),
        saving: false,
      }));
    } catch (error) {
      set({ error: getErrorMessage(error, 'Shopping link could not be updated.'), saving: false });
      throw error;
    }
  },
  deleteLink: async (linkId) => {
    const previous = get().links;
    set((state) => ({ links: state.links.filter((link) => link.id !== linkId), error: null }));
    try {
      await deleteShoppingLink(linkId);
    } catch (error) {
      set({ links: previous, error: getErrorMessage(error, 'Shopping link could not be deleted.') });
      throw error;
    }
  },
  resetLinks: () => set({ links: [], loading: false, saving: false, error: null }),
}));
