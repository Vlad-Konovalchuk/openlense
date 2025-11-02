// Types for Search Page
// TODO: Review and align when backend is ready

export type DataSource = {
  id: string;
  name: string;
  selected: boolean;
};

export type Filter = {
  priceMin?: number;
  priceMax?: number;
  category?: string;
  keywords?: string;
};

export type SearchRequest = {
  sources: string[];
  filters: Filter;
};

export type SearchResult = {
  id: string;
  title: string;
  description?: string;
  price: number;
  priceChange?: number;
  source: string;
  sourceLabel: string;
  date: string;
  metadata?: Record<string, any>;
  link: string;
};
