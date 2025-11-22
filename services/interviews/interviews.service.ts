import apiClient from '../api/client';

export interface ValidateInviteResponse {
  valid: boolean;
  message?: string;
  sessionId?: string;
}

export interface SubmitProfileRequest {
  phoneNumber?: string;
  targetRole: string;
  industryPreference?: string;
  expectedGraduation?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface SubmitConsentRequest {
  consentGiven: boolean;
  dataProcessingConsent: boolean;
  recordingConsent: boolean;
}

export interface SetupSessionRequest {
  roleTitle: string;
  jobDescription: string;
  resume?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    data: string;
  };
}

export interface SubmitPreflightRequest {
  consent: boolean;
  deviceInfo: {
    cameraOk: boolean;
    micOk: boolean;
  };
}

export interface RTCTokenResponse {
  token: string;
  roomUrl: string;
}

export interface InterviewReport {
  status: 'processing' | 'ready';
  report?: any;
}

class InterviewsService {
  async validateInvite(token: string): Promise<ValidateInviteResponse> {
    const response = await apiClient.get<ValidateInviteResponse>(`/api/invite/${token}`);
    return response.data;
  }

  async submitProfile(sessionId: string, data: SubmitProfileRequest): Promise<{ ok: boolean }> {
    const response = await apiClient.post(`/api/session/${sessionId}/profile`, data);
    return response.data;
  }

  async submitConsent(sessionId: string, data: SubmitConsentRequest): Promise<{ ok: boolean }> {
    const response = await apiClient.post(`/api/session/${sessionId}/consent`, data);
    return response.data;
  }

  async setupSession(sessionId: string, data: SetupSessionRequest): Promise<{ ok: boolean }> {
    const response = await apiClient.post(`/api/session/${sessionId}/setup`, data);
    return response.data;
  }

  async submitPreflight(sessionId: string, data: SubmitPreflightRequest): Promise<{ ok: boolean }> {
    const response = await apiClient.post(`/api/session/${sessionId}/preflight`, data);
    return response.data;
  }

  async getRTCToken(sessionId: string): Promise<RTCTokenResponse> {
    const response = await apiClient.get<RTCTokenResponse>(`/api/session/${sessionId}/rtc-token`);
    return response.data;
  }

  async completeInterview(sessionId: string): Promise<{ ok: boolean }> {
    const response = await apiClient.post(`/api/session/${sessionId}/complete`);
    return response.data;
  }

  async getReport(sessionId: string): Promise<InterviewReport> {
    const response = await apiClient.get<InterviewReport>(`/api/session/${sessionId}/report`);
    return response.data;
  }
}

export const interviewsService = new InterviewsService();

