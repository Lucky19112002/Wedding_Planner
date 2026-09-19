import { create } from 'zustand';
import {
  deleteImage,
  getOutfitImages,
  reorderImages,
  setPrimaryImage,
  uploadImage,
} from '@/services/outfitImage.service';
import type { OutfitImage } from '@/types/domain';

type OutfitImageStore = {
  images: OutfitImage[];
  loading: boolean;
  uploadProgress: number;
  error: string | null;
  loadImages: (outfitId: string) => Promise<void>;
  uploadImage: (input: { file: File; outfitId: string; weddingId: string }) => Promise<void>;
  deleteImage: (image: OutfitImage) => Promise<void>;
  moveImage: (imageId: string, direction: -1 | 1) => Promise<void>;
  setPrimaryImage: (imageId: string) => Promise<void>;
  resetImages: () => void;
};

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useOutfitImageStore = create<OutfitImageStore>((set, get) => ({
  images: [],
  loading: false,
  uploadProgress: 0,
  error: null,
  loadImages: async (outfitId) => {
    set({ loading: true, error: null });
    try {
      set({ images: await getOutfitImages(outfitId), loading: false });
    } catch (error) {
      set({ error: getErrorMessage(error, 'Images could not be loaded.'), loading: false });
    }
  },
  uploadImage: async ({ file, outfitId, weddingId }) => {
    set({ error: null, uploadProgress: 1 });
    try {
      const image = await uploadImage({
        existingCount: get().images.length,
        file,
        outfitId,
        weddingId,
        onProgress: (uploadProgress) => set({ uploadProgress }),
      });
      set((state) => ({ images: [...state.images, image], uploadProgress: 0 }));
    } catch (error) {
      set({ error: getErrorMessage(error, 'Image upload failed.'), uploadProgress: 0 });
      throw error;
    }
  },
  deleteImage: async (image) => {
    const previous = get().images;
    set((state) => ({ images: state.images.filter((item) => item.id !== image.id), error: null }));
    try {
      await deleteImage(image);
    } catch (error) {
      set({ images: previous, error: getErrorMessage(error, 'Image could not be deleted.') });
      throw error;
    }
  },
  moveImage: async (imageId, direction) => {
    const previous = get().images;
    const index = previous.findIndex((image) => image.id === imageId);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= previous.length) return;
    const next = [...previous];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    set({ images: next, error: null });
    try {
      set({ images: await reorderImages(next) });
    } catch (error) {
      set({ images: previous, error: getErrorMessage(error, 'Image order could not be saved.') });
      throw error;
    }
  },
  setPrimaryImage: async (imageId) => {
    const previous = get().images;
    const selected = previous.find((image) => image.id === imageId);
    if (!selected) return;
    set({
      images: [selected, ...previous.filter((image) => image.id !== imageId)],
      error: null,
    });
    try {
      set({ images: await setPrimaryImage(previous, imageId) });
    } catch (error) {
      set({ images: previous, error: getErrorMessage(error, 'Primary image could not be saved.') });
      throw error;
    }
  },
  resetImages: () => set({ images: [], loading: false, uploadProgress: 0, error: null }),
}));
