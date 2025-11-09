// Real backend API client
// Replace the mock implementations below with actual API calls to your backend

import type { BackendClient } from './backend-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Helper function to make authenticated requests
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  
  return response.json();
}

/**
 * Real backend client implementation
 * 
 * To enable:
 * 1. Set VITE_USE_MOCK_API=false in your .env file
 * 2. Set VITE_API_URL to your backend URL
 * 3. Implement the actual API calls below
 */
export const realBackend: BackendClient = {
  auth: {
    login: async ({ email, password }) => {
      return apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    
    verifyMagicLink: async ({ token }) => {
      return apiFetch('/auth/magic-link/verify', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    
    requestMagicLink: async ({ email }) => {
      return apiFetch('/auth/magic-link', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    
    me: async () => {
      return apiFetch('/auth/me');
    },
    
    verifyInvite: async ({ token }) => {
      return apiFetch('/auth/onboard/verify', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    
    completeOnboarding: async (data) => {
      return apiFetch('/auth/onboard/complete', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
  
  cohorts: {
    list: async () => {
      return apiFetch('/cohorts');
    },
    
    get: async ({ id }) => {
      return apiFetch(`/cohorts/${id}`);
    },
    
    create: async (data) => {
      return apiFetch('/cohorts', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    addStudents: async ({ cohortId, students }) => {
      return apiFetch(`/cohorts/${cohortId}/students`, {
        method: 'POST',
        body: JSON.stringify({ students }),
      });
    },
    
    sendInvites: async ({ cohortId, studentIds, timeLimit, numberOfInterviews }) => {
      return apiFetch(`/cohorts/${cohortId}/invites`, {
        method: 'POST',
        body: JSON.stringify({ 
          studentIds, 
          timeLimit, 
          numberOfInterviews 
        }),
      });
    },
  },
  
  // Interview endpoints for student-facing WebRTC interview flow
  interviews: {
    validateInvite: async (token: string) => {
      return apiFetch(`/api/invite/${token}`);
    },
    
    submitProfile: async (sessionId: string, data: { 
      phoneNumber?: string; 
      targetRole: string; 
      industryPreference?: string; 
      expectedGraduation?: string; 
      skillLevel: 'beginner' | 'intermediate' | 'advanced';
    }) => {
      return apiFetch(`/api/session/${sessionId}/profile`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    submitConsent: async (sessionId: string, data: { 
      consentGiven: boolean; 
      dataProcessingConsent: boolean; 
      recordingConsent: boolean;
    }) => {
      return apiFetch(`/api/session/${sessionId}/consent`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    setupSession: async (sessionId: string, data: { roleTitle: string; jobDescription: string }) => {
      return apiFetch(`/api/session/${sessionId}/setup`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    submitPreflight: async (sessionId: string, data: { consent: boolean; deviceInfo: { cameraOk: boolean; micOk: boolean } }) => {
      return apiFetch(`/api/session/${sessionId}/preflight`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    getRTCToken: async (sessionId: string) => {
      return apiFetch(`/api/session/${sessionId}/rtc-token`);
    },
    
    completeInterview: async (sessionId: string) => {
      return apiFetch(`/api/session/${sessionId}/complete`, {
        method: 'POST',
      });
    },
    
    getReport: async (sessionId: string) => {
      return apiFetch(`/api/session/${sessionId}/report`);
    },
  },
  
  mockinterviews: {
    verifyToken: async ({ token }) => {
      return apiFetch('/mockinterviews/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
    },
    
    submitConsent: async (data) => {
      return apiFetch('/mockinterviews/submit-consent', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    getSampleJDs: async () => {
      return apiFetch('/mockinterviews/sample-jds');
    },
    
    parseJD: async (data) => {
      return apiFetch('/mockinterviews/parse-jd', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    getJDMetrics: async (data) => {
      return apiFetch('/mockinterviews/get-jd-metrics', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    updateJDMetrics: async (data) => {
      return apiFetch('/mockinterviews/update-jd-metrics', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    completeProfile: async (data) => {
      return apiFetch('/mockinterviews/complete-profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    
    createInterviewSession: async (data) => {
      return apiFetch('/mockinterviews/create-interview-session', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  },
  
  analysis: {
    get: async ({ interviewId }) => {
      return apiFetch(`/analysis/${interviewId}`);
    },
  },
  
  skills: {
    detect: async ({ transcript, interviewId }) => {
      return apiFetch('/skills/detect', {
        method: 'POST',
        body: JSON.stringify({ transcript, interviewId }),
      });
    },
  },
  
  with: function(options: any) {
    // For authenticated requests, the token is already handled in apiFetch
    // This method exists for API compatibility
    return this;
  },
};

export default realBackend;
