import aiSessionsClient from './aiSessions.client';
import type { ApiResponseWrapper } from '@/services/api/types';

export interface CreateSessionRequest {
  session_type: string;
  duration_seconds: number;
  context: {
    job_description?: string;
    company_name?: string;
    role_title?: string;
  };
}

export interface CreateSessionResponse {
  session_id: string;
  status: string;
  message?: string;
}

export interface SessionStatusResponse {
  session_id: string;
  status: string;
  elapsed_time?: number;
  remaining_time?: number;
}

export interface TranscriptResponse {
  transcript: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
  }>;
}

class AISessionsService {
  async createSession(data: CreateSessionRequest): Promise<CreateSessionResponse> {
    const response = await aiSessionsClient.post<ApiResponseWrapper<CreateSessionResponse>>(
      '/api/ai-sessions/',
      data
    );
    return response.data.data;
  }

  async closeSession(sessionId: string): Promise<{ success: boolean }> {
    const response = await aiSessionsClient.post<ApiResponseWrapper<{ success: boolean }>>(
      `/api/ai-sessions/${sessionId}/close`
    );
    return response.data.data;
  }

  async getSessionStatus(sessionId: string): Promise<SessionStatusResponse> {
    const response = await aiSessionsClient.get<ApiResponseWrapper<SessionStatusResponse>>(
      `/api/ai-sessions/${sessionId}/status`
    );
    return response.data.data;
  }

  async getTranscript(sessionId: string): Promise<TranscriptResponse> {
    const response = await aiSessionsClient.get<ApiResponseWrapper<TranscriptResponse>>(
      `/api/ai-sessions/${sessionId}/transcript`
    );
    return response.data.data;
  }

  async cancelSession(sessionId: string): Promise<{ success: boolean }> {
    const response = await aiSessionsClient.delete<ApiResponseWrapper<{ success: boolean }>>(
      `/api/ai-sessions/${sessionId}`
    );
    return response.data.data;
  }
}

export const aiSessionsService = new AISessionsService();

