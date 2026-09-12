import { create } from 'zustand';
import { ImageItem } from '../types/image';
import { storageService } from '../services/storageService';

interface DownloadState {
  downloadedImages: ImageItem[];
  isHydrated: boolean;
  addDownload: (image: ImageItem) => Promise<void>;
  removeDownload: (imageId: string) => Promise<void>;
  isDownloaded: (imageId: string) => boolean;
  clearAllDownloads: () => Promise<void>;
  hydrateDownloads: () => Promise<void>;
}

export const useDownloadStore = create<DownloadState>((set, get) => ({
  downloadedImages: [],
  isHydrated: false,

  hydrateDownloads: async () => {
    try {
      const stored = await storageService.getDownloadedImages();
      set({ downloadedImages: stored || [], isHydrated: true });
    } catch {
      set({ downloadedImages: [], isHydrated: true });
    }
  },

  addDownload: async (image: ImageItem) => {
    const current = get().downloadedImages;
    if (current.some((img) => img.id === image.id)) {
      return;
    }
    const updated = [image, ...current];
    set({ downloadedImages: updated });
    await storageService.saveDownloadedImages(updated);
  },

  removeDownload: async (imageId: string) => {
    const current = get().downloadedImages;
    const updated = current.filter((img) => img.id !== imageId);
    set({ downloadedImages: updated });
    await storageService.saveDownloadedImages(updated);
  },

  isDownloaded: (imageId: string) => {
    return get().downloadedImages.some((img) => img.id === imageId);
  },

  clearAllDownloads: async () => {
    set({ downloadedImages: [] });
    await storageService.saveDownloadedImages([]);
  },
}));
