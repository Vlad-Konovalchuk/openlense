export type AuthMethod = 'none' | 'apiKey' | 'bearerToken';
export type HttpMethod = 'GET' | 'POST';

export type ApiHeaderParam = {
  key: string;
  value: string;
};

export type EndpointPath = {
  name: string;
  path: string;
  method: HttpMethod;
};

export type FieldMappingItem = {
  external: string;
  internal: string;
};

export type ApiFiltersSupport = {
  title?: boolean;
  priceMin?: boolean;
  priceMax?: boolean;
  category?: boolean;
  [key: string]: boolean | undefined;
};

export type BackendDefaultFilters = {
  [key: string]: string | number | boolean;
};

export type CronConfig = {
  enabled: boolean;
  frequency: '6h' | '12h' | 'daily' | 'weekly';
};

export type ApiConfig = {
  id: string;
  name: string;
  baseUrl: string;
  authMethod: AuthMethod;
  authKey?: string;
  defaultMethod: HttpMethod;
  endpoints: EndpointPath[];
  headers: ApiHeaderParam[];
  params: ApiHeaderParam[];
  fieldMapping: FieldMappingItem[];
  apiFilters: ApiFiltersSupport;
  backendDefaults: BackendDefaultFilters;
  cron: CronConfig;
  status: 'active' | 'inactive';
  lastSync?: string;
};
