// API Client - Switches between mock and real backend based on environment
import mockBackend from './mock-backend';
import realBackend from './real-backend';
import type { BackendClient } from './backend-types';

// Check if we should use the mock backend (default: true for safety)
const USE_MOCK = import.meta.env.VITE_USE_MOCK_API !== 'false';

/**
 * The main API client that your app should import.
 * Automatically switches between mock and real backend based on environment.
 * 
 * Development (Mock API - Default):
 * - No .env file needed, or set: VITE_USE_MOCK_API=true
 * - Uses mock data, no backend server required
 * 
 * Production (Real API):
 * 1. Create a .env file with:
 *    VITE_USE_MOCK_API=false
 *    VITE_API_URL=https://your-api.com
 * 2. The app will automatically use real-backend.ts
 * 3. Update real-backend.ts endpoints to match your API
 */
const apiClient: BackendClient = USE_MOCK ? mockBackend : realBackend;

// Log which backend is being used (only in development)
if (import.meta.env.DEV) {
  console.log(`🔌 API Client: Using ${USE_MOCK ? 'MOCK' : 'REAL'} backend`);
  if (!USE_MOCK) {
    console.log(`📡 API URL: ${import.meta.env.VITE_API_URL || 'http://localhost:4000'}`);
  }
}

export default apiClient;
