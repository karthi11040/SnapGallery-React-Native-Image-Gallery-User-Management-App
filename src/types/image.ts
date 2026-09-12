export interface ImageItem {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
  title?: string;
  category?: 'nature' | 'cities' | 'people' | 'architecture' | string;
  tags?: string[];
}

export type FilterType = 'all' | 'nature' | 'cities' | 'people' | 'architecture' | 'am' | 'nz' | 'curated' | string;

export interface ImageFilterOptions {
  searchQuery: string;
  filterType: FilterType;
}
