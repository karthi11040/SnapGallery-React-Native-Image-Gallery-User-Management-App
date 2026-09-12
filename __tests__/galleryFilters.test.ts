import {
  filterImagesBySearch,
  filterImagesByAuthorRange,
  applyImageFilter,
  getAuthorInitials,
} from '../src/utils/filters';
import { ImageItem } from '../src/types/image';

describe('Gallery Filters & Utilities', () => {
  const sampleImages: ImageItem[] = [
    {
      id: '10',
      author: 'Alejandro Escamilla',
      width: 2500,
      height: 1667,
      url: 'https://unsplash.com/photos/6UBndgahIrs',
      download_url: 'https://picsum.photos/id/10/2500/1667',
    },
    {
      id: '11',
      author: 'Paul Jarvis',
      width: 2500,
      height: 1667,
      url: 'https://unsplash.com/photos/Cm7oKel-X2Q',
      download_url: 'https://picsum.photos/id/11/2500/1667',
    },
    {
      id: '12',
      author: 'Dan Rubin',
      width: 2500,
      height: 1667,
      url: 'https://unsplash.com/photos/IWI_0ElSlP4',
      download_url: 'https://picsum.photos/id/12/2500/1667',
    },
    {
      id: '13',
      author: 'Tina Rataj',
      width: 2500,
      height: 1667,
      url: 'https://unsplash.com/photos/DnLPAAjvNkh',
      download_url: 'https://picsum.photos/id/13/2500/1667',
    },
  ];

  describe('filterImagesBySearch', () => {
    it('returns all images when query is empty or whitespace', () => {
      expect(filterImagesBySearch(sampleImages, '')).toEqual(sampleImages);
      expect(filterImagesBySearch(sampleImages, '   ')).toEqual(sampleImages);
    });

    it('performs case-insensitive matching by author name', () => {
      const results = filterImagesBySearch(sampleImages, 'alejandro');
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('Alejandro Escamilla');
    });

    it('finds partial author matches', () => {
      const results = filterImagesBySearch(sampleImages, 'jarvis');
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('11');
    });

    it('returns empty array when no authors match', () => {
      const results = filterImagesBySearch(sampleImages, 'nonexistent');
      expect(results).toHaveLength(0);
    });
  });

  describe('filterImagesByAuthorRange', () => {
    it('filters authors in A-M range', () => {
      const results = filterImagesByAuthorRange(sampleImages, 'am');
      expect(results).toHaveLength(2); // Alejandro Escamilla (A), Dan Rubin (D)
      expect(results.map(r => r.author)).toEqual(['Alejandro Escamilla', 'Dan Rubin']);
    });

    it('filters authors in N-Z range', () => {
      const results = filterImagesByAuthorRange(sampleImages, 'nz');
      expect(results).toHaveLength(2); // Paul Jarvis (P), Tina Rataj (T)
      expect(results.map(r => r.author)).toEqual(['Paul Jarvis', 'Tina Rataj']);
    });

    it('returns only curated favorites when curated filter is active', () => {
      const favIds = ['11', '13'];
      const results = filterImagesByAuthorRange(sampleImages, 'curated', favIds);
      expect(results).toHaveLength(2);
      expect(results.map(r => r.id)).toEqual(['11', '13']);
    });

    it('returns all images when filter is "all"', () => {
      const results = filterImagesByAuthorRange(sampleImages, 'all');
      expect(results).toHaveLength(4);
    });
  });

  describe('applyImageFilter (Combined Search & Filter)', () => {
    it('correctly filters by range and searches simultaneously', () => {
      const results = applyImageFilter(sampleImages, 'dan', 'am');
      expect(results).toHaveLength(1);
      expect(results[0].author).toBe('Dan Rubin');
    });

    it('returns empty when search does not match range-filtered results', () => {
      const results = applyImageFilter(sampleImages, 'paul', 'am');
      expect(results).toHaveLength(0);
    });
  });

  describe('getAuthorInitials', () => {
    it('returns 2-letter initials for standard two-word names', () => {
      expect(getAuthorInitials('Alejandro Escamilla')).toBe('AE');
      expect(getAuthorInitials('Dan Rubin')).toBe('DR');
    });

    it('handles single word author names', () => {
      expect(getAuthorInitials('Unsplash')).toBe('UN');
    });

    it('handles empty or blank author string safely', () => {
      expect(getAuthorInitials('')).toBe('LG');
    });
  });
});
