// Types for Search Page
// TODO: Review and align when backend is ready

export interface DataSource {
    id: string;
    name: string;
    selected: boolean;
}

export interface Filter {
    priceMin?: number;
    priceMax?: number;
    category?: string;
    keywords?: string;
}

export interface SearchRequest {
    sources: string[];
    filters: Filter;
}

export interface SearchResult {
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
}
