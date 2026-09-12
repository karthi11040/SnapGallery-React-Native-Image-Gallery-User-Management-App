import { create } from 'zustand';
import { ImageItem } from '../types/image';
import { storageService } from '../services/storageService';

interface FavoriteState {
  favoriteIds: string[];
  favoriteItems: Record<string, ImageItem>;
  isHydrated: boolean;

  hydrateFavorites: () => Promise<void>;
  addFavorite: (item: ImageItem) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  toggleFavorite: (item: ImageItem) => Promise<void>;
  isFavorite: (id: string) => boolean;
}

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favoriteIds: [],
  favoriteItems: {},
  isHydrated: false,

  hydrateFavorites: async () => {
    const ids = await storageService.getFavorites();
    set({ favoriteIds: ids, isHydrated: true });
  },

  addFavorite: async (item: ImageItem) => {
    const currentIds = get().favoriteIds;
    if (currentIds.includes(item.id)) return;

    const newIds = [item.id, ...currentIds];
    const newItems = { ...get().favoriteItems, [item.id]: item };
    set({ favoriteIds: newIds, favoriteItems: newItems });
    await storageService.saveFavorites(newIds);
  },

  removeFavorite: async (id: string) => {
    const newIds = get().favoriteIds.filter((favId) => favId !== id);
    const newItems = { ...get().favoriteItems };
    delete newItems[id];
    set({ favoriteIds: newIds, favoriteItems: newItems });
    await storageService.saveFavorites(newIds);
  },

  toggleFavorite: async (item: ImageItem) => {
    const isFav = get().isFavorite(item.id);
    if (isFav) {
      await get().removeFavorite(item.id);
    } else {
      await get().addFavorite(item);
    }
  },

  isFavorite: (id: string) => {
    return get().favoriteIds.includes(id);
  },
}));
