import { apiService } from './api';

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand';
  id: string;
  label: string;
  imageUrl: string | null;
  url: string;
}

export interface SearchResult {
  products: Array<{
    id: string;
    title: string;
    price: string;
    coverImage: string | null;
    sellerName: string;
    rating: number;
  }>;
  total: number;
  totalPages: number;
}

export const searchService = {
  getSuggestions(query: string): Promise<SearchSuggestion[]> {
    return apiService.get<SearchSuggestion[]>(`v1/search/suggestions?q=${encodeURIComponent(query)}`);
  },

  search(query: string, page = 1, filters?: Record<string, string>): Promise<SearchResult> {
    const q = new URLSearchParams({ q: query, page: String(page), ...filters });
    return apiService.get<SearchResult>(`v1/search?${q}`);
  },
};
