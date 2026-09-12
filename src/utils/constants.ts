export const STORAGE_KEYS = {
  USER: '@snapgallery/user',
  SESSION: '@snapgallery/session',
  FAVORITES: '@snapgallery/favorites',
  THEME: '@snapgallery/theme',
  REMEMBERED_CREDS: '@snapgallery/remembered_creds',
  CREDITS: '@snapgallery/credits',
  DOWNLOADS: '@snapgallery/downloads',
} as const;

export const PICSUM_BASE_URL = 'https://picsum.photos/v2/list';

export const CITIES = [
  'San Francisco, CA',
  'New York City, NY',
  'Los Angeles, CA',
  'Seattle, WA',
  'Chicago, IL',
  'Austin, TX',
  'Boston, MA',
  'Denver, CO',
] as const;

export const GENDERS = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'unspecified' },
] as const;
