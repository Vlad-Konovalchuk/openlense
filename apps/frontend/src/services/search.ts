import { useQuery } from '@tanstack/react-query';
import apiClient from './apiClient';
import { queryKeys } from './queryClient';

export type SearchResult<T = any> = {
  id: string;
  title?: string;
  price?: number;
  currency?: string;
  url?: string;
  image_url?: string;
  source: string;
  source_id: string;
  data: T;
  created_time?: string;
};

export type SearchParams = Record<
  string,
  string | number | boolean | undefined
> & {
  source_ids?: string[];
};

function buildQuery(params: SearchParams): Record<string, string> {
  const out: Record<string, string> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined) return;
    if (k === 'source_ids' && Array.isArray(v)) {
      if (v.length) out['source_ids'] = v.join(',');
      return;
    }
    out[k] = String(v);
  });
  return out;
}

export function useSearch(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.search.results(params),
    queryFn: async () => {
      const res = await apiClient.get<SearchResult[]>(`/api/v1/search/`, {
        params: buildQuery(params),
      });
      return res.data;
    },
    enabled: true,
  });
}

export function useSupportedApis() {
  return useQuery({
    queryKey: queryKeys.search.supportedApis(),
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/search/supported-apis`);
      return res.data as Array<{
        id: string;
        name: string;
        description?: string;
        endpoint: string;
        method: string;
        supported_filters: string[];
        api_filters: string[];
        backend_filters: string[];
        is_active: boolean;
        auth_required: boolean;
        last_updated: string;
      }>;
    },
    staleTime: 60_000,
  });
}
