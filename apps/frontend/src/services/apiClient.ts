import axios, { AxiosError } from 'axios';

// Create a pre-configured Axios instance following best practices
// - Single instance
// - Base URL from env with sane fallback
// - Timeouts & JSON headers
// - Response error normalization

const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    /* Normalize error shape for UI */
    const status = error.response?.status ?? 0;
    const message =
      (error.response?.data as any)?.detail || error.message || 'Unknown error';

    return Promise.reject({
      status,
      message,
      data: error.response?.data,
      original: error,
    });
  },
);

export default apiClient;
