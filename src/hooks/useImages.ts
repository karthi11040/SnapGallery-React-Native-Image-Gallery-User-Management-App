import { useEffect, useMemo } from 'react';
import { useImageStore } from '../store/imageStore';
import { useFavoriteStore } from '../store/favoriteStore';
import { applyImageFilter } from '../utils/filters';

export function useImages() {
  const images = useImageStore((state) => state.images);
  const isLoading = useImageStore((state) => state.isLoading);
  const isRefreshing = useImageStore((state) => state.isRefreshing);
  const isLoadingMore = useImageStore((state) => state.isLoadingMore);
  const error = useImageStore((state) => state.error);
  const searchQuery = useImageStore((state) => state.searchQuery);
  const filterType = useImageStore((state) => state.filterType);

  const fetchInitialImages = useImageStore((state) => state.fetchInitialImages);
  const refreshImages = useImageStore((state) => state.refreshImages);
  const loadMoreImages = useImageStore((state) => state.loadMoreImages);
  const setSearchQuery = useImageStore((state) => state.setSearchQuery);
  const setFilterType = useImageStore((state) => state.setFilterType);

  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const hydrateFavorites = useFavoriteStore((state) => state.hydrateFavorites);

  useEffect(() => {
    hydrateFavorites();
    if (images.length === 0) {
      fetchInitialImages();
    }
  }, [fetchInitialImages, hydrateFavorites, images.length]);

  const filteredImages = useMemo(() => {
    return applyImageFilter(images, searchQuery, filterType, favoriteIds);
  }, [images, searchQuery, filterType, favoriteIds]);

  return {
    images: filteredImages,
    allImagesCount: images.length,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    searchQuery,
    filterType,
    fetchInitialImages,
    refreshImages,
    loadMoreImages,
    setSearchQuery,
    setFilterType,
  };
}
