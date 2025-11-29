import apiClient from '../api/client';
import type { ApiResponseWrapper } from '@/services/api/types';

export interface CreateSessionRequest {
  session_type: string;
  duration_seconds: number;
  session_log_id?: string;
  // context: {
  //   job_description: string;
  //   company_name: string;
  //   role_title: string;
  // };
}

export interface CreateSessionResponse {
  session_id: string;
  status: string;
  message?: string;
}

export interface SessionStatusResponse {
  session_id: string;
  session_type: string;
  status: string;
  duration_seconds: number;
  created_at: string;
  started_at: string;
  has_transcript: boolean;
}

export interface TranscriptMessage {
  timestamp: string;
  role: 'user' | 'assistant';
  content: string;
  speaker: string;
}

export interface SessionContext {
  job_title?: string;
  job_description?: string;
  company_name?: string;
}

export interface CloseSessionResponse {
  session_id: string;
  session_type: string;
  status: string;
  transcript: TranscriptMessage[];
  duration_seconds: number;
  actual_duration: number;
  created_at: string;
  started_at: string;
  completed_at: string;
  context: SessionContext;
}

export interface TranscriptResponse {
  session_id: string;
  session_type: string;
  status: string;
  transcript: TranscriptMessage[];
  duration_seconds: number;
  actual_duration: number;
  created_at: string;
  started_at: string;
  completed_at: string;
  context: SessionContext;
}

class AISessionsService {
  async createSession(data: CreateSessionRequest): Promise<CreateSessionResponse> {
    const response = await apiClient.post<ApiResponseWrapper<CreateSessionResponse>>(
      '/ai-sessions/',
      data
    );
    return response.data.data;
  }

  async closeSession(sessionId: string): Promise<CloseSessionResponse> {
    console.log('Calling closeSession API with sessionId:', sessionId);
    const response = await apiClient.post<ApiResponseWrapper<CloseSessionResponse>>(
      `/ai-sessions/${sessionId}/close`
    );
    console.log('Close session response:', response.data);
    return response.data.data;
  }

  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    const response = await apiClient.get<ApiResponseWrapper<SessionStatusResponse>>(
      `/ai-sessions/${sessionId}/status`
    );
    return response.data.data;
  }

  async getAnalysis(sessionLogId: string): Promise<any> {
    const response = await apiClient.get<ApiResponseWrapper<any>>(
      `/ai-sessions/analysis/${sessionLogId}`
    );
    return response.data.data;
  }

  async getTranscript(sessionId: string): Promise<TranscriptResponse> {
    const response = await apiClient.get<ApiResponseWrapper<TranscriptResponse>>(
      `/ai-sessions/${sessionId}/transcript`
    );
    return response.data.data;
  }

  async cancelSession(sessionId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete<ApiResponseWrapper<{ success: boolean }>>(
      `/ai-sessions/${sessionId}`
    );
    return response.data.data;
  }
}

export const aiSessionsService = new AISessionsService();

