import { ImageItem, FilterType } from '../types/image';

const NATURE_TITLES = [
  'Mountain Serenity',
  'Forest Mist',
  'Alpine Sunset',
  'Lakeside Reflections',
  'Valley Horizon',
  'Wilderness Paths',
];

const CITY_TITLES = [
  'Urban Skyline',
  'Metropolis Lights',
  'Architectural Lines',
  'City Echoes',
  'Downtown Pulse',
  'Concrete Horizon',
];

const PEOPLE_TITLES = [
  'Human Stories',
  'Portrait in Light',
  'Expression in Shadow',
  'Street Character',
  'Candid Moments',
  'Lifestyle Perspective',
];

export function enrichImageMetadata(image: ImageItem): ImageItem {
  if (image.category && image.title && image.tags) {
    return image;
  }

  const numId = parseInt(image.id, 10) || 0;
  const mod = numId % 3;

  let category: 'nature' | 'cities' | 'people' = 'nature';
  let title = NATURE_TITLES[numId % NATURE_TITLES.length];
  let tags = ['nature', 'mountains', 'landscape', 'outdoor', 'scenery'];

  if (mod === 1) {
    category = 'cities';
    title = CITY_TITLES[numId % CITY_TITLES.length];
    tags = ['cities', 'urban', 'architecture', 'buildings', 'skyline'];
  } else if (mod === 2) {
    category = 'people';
    title = PEOPLE_TITLES[numId % PEOPLE_TITLES.length];
    tags = ['people', 'portrait', 'lifestyle', 'human', 'culture'];
  }

  return {
    ...image,
    title: image.title || title,
    category: image.category || category,
    tags: image.tags || tags,
  };
}

export function filterImagesBySearch(images: ImageItem[], query: string): ImageItem[] {
  if (!query || !query.trim()) {
    return images;
  }
  const cleanQuery = query.trim().toLowerCase();
  return images.filter((rawImg) => {
    const img = enrichImageMetadata(rawImg);
    const matchAuthor = img.author.toLowerCase().includes(cleanQuery);
    const matchTitle = (img.title || '').toLowerCase().includes(cleanQuery);
    const matchCategory = (img.category || '').toLowerCase().includes(cleanQuery);
    const matchTags = (img.tags || []).some((tag) => tag.toLowerCase().includes(cleanQuery));
    const matchId = img.id.includes(cleanQuery);

    return matchAuthor || matchTitle || matchCategory || matchTags || matchId;
  });
}

export function filterImagesByAuthorRange(
  images: ImageItem[],
  filterType: FilterType,
  favoriteIds: string[] = []
): ImageItem[] {
  const fType = (filterType || 'all').toLowerCase();

  switch (fType) {
    case 'nature':
    case 'cities':
    case 'people':
    case 'architecture':
      return images.filter((rawImg) => {
        const img = enrichImageMetadata(rawImg);
        return (img.category || '').toLowerCase() === fType;
      });
    case 'am':
      return images.filter((img) => {
        const firstLetter = img.author.trim().charAt(0).toUpperCase();
        return firstLetter >= 'A' && firstLetter <= 'M';
      });
    case 'nz':
      return images.filter((img) => {
        const firstLetter = img.author.trim().charAt(0).toUpperCase();
        return firstLetter >= 'N' && firstLetter <= 'Z';
      });
    case 'curated':
      return images.filter((img) => favoriteIds.includes(img.id));
    case 'all':
    default:
      return images;
  }
}

export function applyImageFilter(
  images: ImageItem[],
  query: string,
  filterType: FilterType,
  favoriteIds: string[] = []
): ImageItem[] {
  const rangeFiltered = filterImagesByAuthorRange(images, filterType, favoriteIds);
  return filterImagesBySearch(rangeFiltered, query);
}

export function getAuthorInitials(author: string): string {
  if (!author || !author.trim()) return 'LG';
  const parts = author.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
