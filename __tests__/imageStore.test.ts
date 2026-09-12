import { useImageStore } from '../src/store/imageStore';
import { imagesApi } from '../src/api/imagesApi';

jest.mock('../src/api/imagesApi', () => ({
  imagesApi: {
    fetchImages: jest.fn(),
  },
  ImagesApiError: class extends Error {},
}));

describe('useImageStore', () => {
  const mockImagesPage1 = [
    {
      id: '1',
      author: 'Alejandro Escamilla',
      width: 5000,
      height: 3333,
      url: 'https://unsplash.com/photos/y83nwVQ5beM',
      download_url: 'https://picsum.photos/id/1/5000/3333',
    },
    {
      id: '2',
      author: 'Alejandro Escamilla',
      width: 5000,
      height: 3333,
      url: 'https://unsplash.com/photos/N7XodRrbzS0',
      download_url: 'https://picsum.photos/id/2/5000/3333',
    },
  ];

  const mockImagesPage2 = [
    {
      id: '3',
      author: 'Paul Jarvis',
      width: 2500,
      height: 1667,
      url: 'https://unsplash.com/photos/Cm7oKel-X2Q',
      download_url: 'https://picsum.photos/id/3/2500/1667',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useImageStore.setState({
      images: [],
      isLoading: false,
      isRefreshing: false,
      isLoadingMore: false,
      error: null,
      page: 1,
      hasMore: true,
      searchQuery: '',
      filterType: 'all',
    });
  });

  it('fetches initial images on start', async () => {
    (imagesApi.fetchImages as jest.Mock).mockResolvedValueOnce(mockImagesPage1);

    await useImageStore.getState().fetchInitialImages();

    const state = useImageStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.images).toEqual(mockImagesPage1);
    expect(state.page).toBe(1);
    expect(state.error).toBeNull();
  });

  it('handles API error gracefully', async () => {
    (imagesApi.fetchImages as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await useImageStore.getState().fetchInitialImages();

    const state = useImageStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toContain('Failed to load gallery');
    expect(state.images).toEqual([]);
  });

  it('refreshes gallery via pull-to-refresh', async () => {
    (imagesApi.fetchImages as jest.Mock).mockResolvedValueOnce(mockImagesPage1);

    await useImageStore.getState().refreshImages();

    const state = useImageStore.getState();
    expect(state.isRefreshing).toBe(false);
    expect(state.images).toEqual(mockImagesPage1);
  });

  it('loads next page and deduplicates existing image IDs', async () => {
    useImageStore.setState({ images: mockImagesPage1, page: 1, hasMore: true });

    // Return page 2 with an already existing item (id: 2) and new item (id: 3)
    (imagesApi.fetchImages as jest.Mock).mockResolvedValueOnce([
      mockImagesPage1[1], // Duplicate ID 2
      mockImagesPage2[0], // New ID 3
    ]);

    await useImageStore.getState().loadMoreImages();

    const state = useImageStore.getState();
    expect(state.isLoadingMore).toBe(false);
    expect(state.images).toHaveLength(3);
    expect(state.images.map((i) => i.id)).toEqual(['1', '2', '3']);
    expect(state.page).toBe(2);
  });

  it('updates searchQuery and filterType correctly', () => {
    useImageStore.getState().setSearchQuery('Paul');
    expect(useImageStore.getState().searchQuery).toBe('Paul');

    useImageStore.getState().setFilterType('nz');
    expect(useImageStore.getState().filterType).toBe('nz');
  });
});
