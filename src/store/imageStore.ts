import { create } from 'zustand';
import { ImageItem, FilterType } from '../types/image';
import { imagesApi, ImagesApiError } from '../api/imagesApi';

interface ImageState {
  images: ImageItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  searchQuery: string;
  filterType: FilterType;

  fetchInitialImages: () => Promise<void>;
  refreshImages: () => Promise<void>;
  loadMoreImages: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilterType: (filter: FilterType) => void;
}

const PAGE_LIMIT = 20;

export const useImageStore = create<ImageState>((set, get) => ({
  images: [],
  isLoading: false,
  isRefreshing: false,
  isLoadingMore: false,
  error: null,
  page: 1,
  hasMore: true,
  searchQuery: '',
  filterType: 'all',

  fetchInitialImages: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null, page: 1, hasMore: true });

    try {
      const items = await imagesApi.fetchImages(1, PAGE_LIMIT);
      set({
        images: items,
        isLoading: false,
        hasMore: items.length >= PAGE_LIMIT,
        page: 1,
      });
    } catch (err) {
      const message = err instanceof ImagesApiError ? err.message : 'Failed to load gallery photos.';
      set({ error: message, isLoading: false });
    }
  },

  refreshImages: async () => {
    if (get().isRefreshing) return;
    set({ isRefreshing: true, error: null });

    try {
      const items = await imagesApi.fetchImages(1, PAGE_LIMIT);
      set({
        images: items,
        isRefreshing: false,
        hasMore: items.length >= PAGE_LIMIT,
        page: 1,
      });
    } catch (err) {
      const message = err instanceof ImagesApiError ? err.message : 'Failed to refresh gallery.';
      set({ error: message, isRefreshing: false });
    }
  },

  loadMoreImages: async () => {
    const { isLoadingMore, isLoading, isRefreshing, hasMore, page, images } = get();
    if (isLoadingMore || isLoading || isRefreshing || !hasMore) return;

    set({ isLoadingMore: true });
    const nextPage = page + 1;

    try {
      const newItems = await imagesApi.fetchImages(nextPage, PAGE_LIMIT);
      if (newItems.length === 0) {
        set({ hasMore: false, isLoadingMore: false });
        return;
      }

      // Avoid duplicates
      const existingIds = new Set(images.map((img) => img.id));
      const filteredNew = newItems.filter((img) => !existingIds.has(img.id));

      set({
        images: [...images, ...filteredNew],
        page: nextPage,
        hasMore: newItems.length >= PAGE_LIMIT,
        isLoadingMore: false,
      });
    } catch {
      set({ isLoadingMore: false });
    }
  },

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setFilterType: (filter: FilterType) => set({ filterType: filter }),
}));
