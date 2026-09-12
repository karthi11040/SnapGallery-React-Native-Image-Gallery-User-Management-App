import { useMemo } from 'react';
import { useFavoriteStore } from '../store/favoriteStore';
import { useImageStore } from '../store/imageStore';
import { ImageItem } from '../types/image';

export function useFavorites() {
  const favoriteIds = useFavoriteStore((state) => state.favoriteIds);
  const favoriteItems = useFavoriteStore((state) => state.favoriteItems);
  const toggleFavorite = useFavoriteStore((state) => state.toggleFavorite);
  const removeFavorite = useFavoriteStore((state) => state.removeFavorite);
  const isFavorite = useFavoriteStore((state) => state.isFavorite);

  const images = useImageStore((state) => state.images);

  const favoritesList: ImageItem[] = useMemo(() => {
    // Collect from cached favoriteItems or imageStore
    const imageMap = new Map<string, ImageItem>(images.map((img) => [img.id, img]));
    return favoriteIds
      .map((id) => favoriteItems[id] || imageMap.get(id))
      .filter((item): item is ImageItem => item !== undefined);
  }, [favoriteIds, favoriteItems, images]);

  return {
    favoriteIds,
    favoritesList,
    totalFavorites: favoriteIds.length,
    toggleFavorite,
    removeFavorite,
    isFavorite,
  };
}
