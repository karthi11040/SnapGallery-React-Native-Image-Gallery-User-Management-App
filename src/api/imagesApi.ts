import { ImageItem } from '../types/image';
import { PICSUM_BASE_URL } from '../utils/constants';

export class ImagesApiError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = 'ImagesApiError';
    this.statusCode = statusCode;
  }
}

export const imagesApi = {
  async fetchImages(page: number = 1, limit: number = 20): Promise<ImageItem[]> {
    try {
      const url = `${PICSUM_BASE_URL}?page=${page}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new ImagesApiError(
          `Failed to fetch images from gallery (HTTP ${response.status})`,
          response.status
        );
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new ImagesApiError('Received invalid data format from gallery API.');
      }

      return data as ImageItem[];
    } catch (err: unknown) {
      if (err instanceof ImagesApiError) {
        throw err;
      }
      const message =
        err instanceof Error ? err.message : 'Network error occurred while fetching images.';
      throw new ImagesApiError(message);
    }
  },
};
