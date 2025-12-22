import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - inject auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const { state } = JSON.parse(authStorage);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch {
        // Invalid JSON in storage, ignore
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect to login
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export const getApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string; details?: { issues?: Array<{ message: string }> } }>;
    return {
      message: axiosError.response?.data?.error ||
               axiosError.response?.data?.message ||
               axiosError.message ||
               'An unexpected error occurred',
      statusCode: axiosError.response?.status || 500,
      errors: axiosError.response?.data?.details?.issues?.reduce((acc, issue, idx) => {
        acc[`field_${idx}`] = [issue.message];
        return acc;
      }, {} as Record<string, string[]>),
    };
  }
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    statusCode: 500,
  };
};
