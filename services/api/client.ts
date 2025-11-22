import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toastDispatcher } from '@/lib/toast-dispatcher';

// API Error Response Format
interface ApiErrorResponse {
  status_code?: number;
  message?: string;
  data?: any;
  error?: {
    detail?: string;
    [key: string]: any;
  };
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.clarivue.io/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Helper function to extract error message from API response
function extractErrorMessage(errorData: any): string {
  // Check for the API error format: { status_code, message, data, error: { detail } }
  if (errorData?.error?.detail) {
    return errorData.error.detail;
  }
  
  // Fall back to message field
  if (errorData?.message) {
    return errorData.message;
  }
  
  // Fall back to generic error message
  return 'An error occurred';
}

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const errorData = error.response.data;
      
      // Extract error message
      const errorMessage = extractErrorMessage(errorData);
      const statusCode = errorData?.status_code || status;
      
      // Show toast notification for errors (except 401 which redirects)
      if (status !== 401) {
        toastDispatcher.error(
          errorData?.message || 'Error',
          errorMessage
        );
      }
      
      // if (status === 401) {
      //   // Unauthorized - clear token and redirect to login
      //   localStorage.removeItem('auth_token');
      //   toastDispatcher.error('Session Expired', 'Please log in again');
      //   if (window.location.pathname !== '/login') {
      //     window.location.href = '/login';
      //   }
      // }
      
      // Create error with extracted message
      const errorWithMessage = new Error(errorMessage);
      (errorWithMessage as any).status = statusCode;
      return Promise.reject(errorWithMessage);
    } else if (error.request) {
      // Request was made but no response received
      const networkError = 'Network error. Please check your connection.';
      toastDispatcher.error('Network Error', networkError);
      return Promise.reject(new Error(networkError));
    } else {
      // Something else happened
      toastDispatcher.error('Error', error.message || 'An unexpected error occurred');
      return Promise.reject(error);
    }
  }
);

export default apiClient;

