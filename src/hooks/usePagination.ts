import { useCallback } from 'react';
import { useImageStore } from '../store/imageStore';

export function usePagination() {
  const isLoadingMore = useImageStore((state) => state.isLoadingMore);
  const hasMore = useImageStore((state) => state.hasMore);
  const loadMoreImages = useImageStore((state) => state.loadMoreImages);

  const handleEndReached = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      loadMoreImages();
    }
  }, [isLoadingMore, hasMore, loadMoreImages]);

  return {
    onEndReached: handleEndReached,
    onEndReachedThreshold: 0.5,
    isLoadingMore,
    hasMore,
  };
}
