import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from './apiClient';
import { queryKeys } from './queryClient';

export type QueryParamDescriptor = {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label?: string;
  default?: string;
  required?: boolean;
  user_editable?: boolean;
  hidden?: boolean;
  options?: string[];
  api_param?: string;
};

export type FilterDescriptor = {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  label?: string;
  filterable?: boolean;
  options?: string[];
  path?: string;
  operators?: string[];
};

export type SourceCreate = {
  name: string;
  description?: string;
  endpoint: string;
  method: string;
  mapping?: Record<string, any>;
  api_filters?: QueryParamDescriptor[];
  backend_filters?: FilterDescriptor[];
  is_active: boolean;
  auth_required: boolean;
  api_key?: string;
  rate_limit?: number;
  request_timeout: number;
  supports_pagination: boolean;
  max_pages_for_backend_filters: number;
  pagination_style?: string;
  headers?: Record<string, string>;
};

export type Source = SourceCreate & {
  id: string;
  created_at?: string;
  updated_at?: string;
};

const SOURCE_API_PATH = '/sources';

export function useSourcesList() {
  return useQuery({
    queryKey: queryKeys.sources.list(),
    queryFn: async () => {
      const res = await apiClient.get<Source[]>(`${SOURCE_API_PATH}/`);
      return res.data;
    },
  });
}

export function useCreateSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SourceCreate) => {
      const res = await apiClient.post<Source>(`${SOURCE_API_PATH}/`, payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sources.all });
    },
  });
}

export function useDeleteSource() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`${SOURCE_API_PATH}/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sources.all });
    },
  });
}

export function useLoadExampleSources() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post(`${SOURCE_API_PATH}/examples/load`);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sources.all });
    },
  });
}

export function useSourceFilters(sourceId: string | undefined) {
  return useQuery({
    enabled: !!sourceId,
    queryKey: queryKeys.sources.filters(sourceId || ''),
    queryFn: async () => {
      const res = await apiClient.get(`${SOURCE_API_PATH}/${sourceId}/filters`);
      return res.data as {
        source_id: string;
        source_name: string;
        api_filters: QueryParamDescriptor[];
        backend_filters: FilterDescriptor[];
      };
    },
  });
}

export function useBackendFilterTemplates() {
  return useQuery({
    queryKey: queryKeys.sources.templates(),
    queryFn: async () => {
      const res = await apiClient.get(
        `${SOURCE_API_PATH}/backend-filter-templates`,
      );
      return res.data as {
        types: string[];
        operators: Record<string, string[]>;
      };
    },
    staleTime: 24 * 60 * 60 * 1000,
  });
}
