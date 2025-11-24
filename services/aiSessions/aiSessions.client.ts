import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { toastDispatcher } from '@/lib/toast-dispatcher';

// AI Sessions API Client - Uses localhost:8000 for local Docker setup
// This is separate from the main API client because AI sessions run on a different port
const AI_SESSIONS_BASE_URL = import.meta.env.VITE_AI_SESSIONS_URL || 'http://localhost:8000';

// Create axios instance for AI sessions
const aiSessionsClient: AxiosInstance = axios.create({
  baseURL: AI_SESSIONS_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add auth token (session_access_token)
aiSessionsClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Use session_access_token for AI sessions
    const sessionToken = localStorage.getItem('session_access_token');
    
    if (sessionToken && config.headers) {
      config.headers.Authorization = `Bearer ${sessionToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
aiSessionsClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      // Extract error message
      let errorMessage = 'An error occurred';
      
      // Handle validation errors (422) - often have array of errors
      if (status === 422 && Array.isArray(errorData?.detail)) {
        const validationErrors = errorData.detail.map((err: any) => {
          if (typeof err === 'string') return err;
          if (err?.msg) return err.msg;
          if (err?.message) return err.message;
          return JSON.stringify(err);
        }).join(', ');
        errorMessage = validationErrors || 'Validation error';
      } else if (errorData?.error?.detail) {
        // Handle nested error detail
        if (typeof errorData.error.detail === 'string') {
          errorMessage = errorData.error.detail;
        } else if (Array.isArray(errorData.error.detail)) {
          errorMessage = errorData.error.detail.map((e: any) => 
            typeof e === 'string' ? e : e?.msg || JSON.stringify(e)
          ).join(', ');
        } else {
          errorMessage = JSON.stringify(errorData.error.detail);
        }
      } else if (errorData?.detail) {
        if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map((e: any) => 
            typeof e === 'string' ? e : e?.msg || JSON.stringify(e)
          ).join(', ');
        } else {
          errorMessage = JSON.stringify(errorData.detail);
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      }
      
      // Show toast for non-401 errors
      if (status !== 401) {
        toastDispatcher.error('AI Session Error', errorMessage);
      }
      
      // Create error with extracted message
      const errorWithMessage = new Error(errorMessage);
      (errorWithMessage as any).response = error.response;
      return Promise.reject(errorWithMessage);
    } else if (error.request) {
      const networkError = 'Network error. Please check your connection.';
      toastDispatcher.error('Network Error', networkError);
      return Promise.reject(new Error(networkError));
    } else {
      toastDispatcher.error('Error', error.message || 'An unexpected error occurred');
      return Promise.reject(error);
    }
  }
);

export default aiSessionsClient;

