import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000, // data considered fresh for 30s
        gcTime: 5 * 60_000, // cache garbage collected after 5 min
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: false,
        // suspense: false,
        // useErrorBoundary: false,
      },
      mutations: {
        retry: 1,
        // useErrorBoundary: false,
      },
    },
  });
}

export type AppQueryClient = ReturnType<typeof createQueryClient>;

export const queryKeys = {
  sources: {
    all: ['api-sources'] as const,
    list: () => [...queryKeys.sources.all] as const,
    detail: (id: string) => [...queryKeys.sources.all, id] as const,
    filters: (id: string) => [...queryKeys.sources.all, id, 'filters'] as const,
    templates: () =>
      [...queryKeys.sources.all, 'backend-filter-templates'] as const,
  },
  search: {
    results: (params: Record<string, any>) => ['search', params] as const,
    supportedApis: () => ['supported-apis'] as const,
  },
};
