import apiClient from '../api/client';
import type { StudentInfo, SampleJD, JDMetric } from '@/lib/backend-types';

export interface VerifyTokenRequest {
  token: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  currentStep: string;
  student: StudentInfo;
  message?: string;
}

export interface SubmitConsentRequest {
  token: string;
  consentGiven: boolean;
  dataProcessingConsent: boolean;
  recordingConsent: boolean;
}

export interface ParseJDRequest {
  token: string;
  jobDescription: string;
}

export interface ParseJDResponse {
  success: boolean;
  jdId: string;
  message?: string;
}

export interface GetJDMetricsRequest {
  token: string;
  jdId: string;
}

export interface GetJDMetricsResponse {
  success: boolean;
  jobTitle: string;
  companyName: string;
  metrics: JDMetric[];
  message?: string;
}

export interface UpdateJDMetricsRequest {
  token: string;
  jdId: string;
  metrics: JDMetric[];
}

export interface CompleteProfileRequest {
  token: string;
  phoneNumber?: string;
  targetRole: string;
  industryPreference?: string;
  expectedGraduation?: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface CreateInterviewSessionRequest {
  token: string;
  jdId: string;
}

export interface CreateInterviewSessionResponse {
  success: boolean;
  sessionId: string;
  sessionUrl: string;
  message?: string;
}

class MockInterviewsService {
  async verifyToken(data: VerifyTokenRequest): Promise<VerifyTokenResponse> {
    const response = await apiClient.post<VerifyTokenResponse>('/mockinterviews/verify-token', data);
    return response.data;
  }

  async submitConsent(data: SubmitConsentRequest): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post('/mockinterviews/submit-consent', data);
    return response.data;
  }

  async getSampleJDs(): Promise<{ samples: SampleJD[] }> {
    const response = await apiClient.get<{ samples: SampleJD[] }>('/mockinterviews/sample-jds');
    return response.data;
  }

  async parseJD(data: ParseJDRequest): Promise<ParseJDResponse> {
    const response = await apiClient.post<ParseJDResponse>('/mockinterviews/parse-jd', data);
    return response.data;
  }

  async getJDMetrics(data: GetJDMetricsRequest): Promise<GetJDMetricsResponse> {
    const response = await apiClient.post<GetJDMetricsResponse>('/mockinterviews/get-jd-metrics', data);
    return response.data;
  }

  async updateJDMetrics(data: UpdateJDMetricsRequest): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post('/mockinterviews/update-jd-metrics', data);
    return response.data;
  }

  async completeProfile(data: CompleteProfileRequest): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.post('/mockinterviews/complete-profile', data);
    return response.data;
  }

  async createInterviewSession(data: CreateInterviewSessionRequest): Promise<CreateInterviewSessionResponse> {
    const response = await apiClient.post<CreateInterviewSessionResponse>('/mockinterviews/create-interview-session', data);
    return response.data;
  }
}

export const mockInterviewsService = new MockInterviewsService();

