import apiClient from '../api/client';
import type { ApiResponseWrapper } from '../api/types';

// Session Invite type
export interface SessionInvite {
  _id: string;
  cohort_id: string;
  description: string;
  expires_in_days: number;
  session_type: string;
  time_limit_minutes: number;
  total_sessions_allowed: number;
  user_emails: string[];
  created_at: string;
  updated_at: string;
  [key: string]: any; // For additional fields
}

// Paginated invites response
export interface PaginatedInvitesResponse {
  items: SessionInvite[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// List invites params
export interface ListInvitesParams {
  search?: string;
  cohort_id?: string;
  session_type?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// Create batch invite request
export interface CreateBatchInviteRequest {
  cohort_id: string;
  description?: string;
  expires_in_days?: number;
  session_type?: string;
  time_limit_minutes: number;
  total_sessions_allowed: number;
  user_emails: string[];
}

// Extend user sessions request
export interface ExtendUserSessionsRequest {
  expires_in_days?: number;
  additional_sessions?: number;
}

// Verify session token request
export interface VerifySessionTokenRequest {
  token: string;
}

// Verify session token response
export interface VerifySessionTokenResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  user_name: string;
  user_email: string;
  sessions_remaining: number;
  time_limit_minutes: number;
  session_type: string;
  cohort_name: string;
}

// Start session response
export interface StartSessionResponse {
  session_access_token: string;
  token_type: string;
  session_log_id: string;
  sessions_remaining: number;
  time_limit_minutes: number;
  session_type: string;
  cohort_name: string;
}

class SessionInvitesService {
  async list(params?: ListInvitesParams): Promise<PaginatedInvitesResponse> {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedInvitesResponse>>('/session-invites', {
      params,
    });
    return response.data.data;
  }

  async get(inviteId: string): Promise<SessionInvite> {
    const response = await apiClient.get<ApiResponseWrapper<SessionInvite>>(`/session-invites/${inviteId}`);
    return response.data.data;
  }

  async createBatch(data: CreateBatchInviteRequest): Promise<SessionInvite> {
    const response = await apiClient.post<ApiResponseWrapper<SessionInvite>>('/session-invites', data);
    return response.data.data;
  }

  async delete(inviteId: string): Promise<void> {
    await apiClient.delete(`/session-invites/${inviteId}`);
  }

  async getStats(inviteId: string): Promise<any> {
    const response = await apiClient.get<ApiResponseWrapper<any>>(`/session-invites/${inviteId}/stats`);
    return response.data.data;
  }

  async extendUserSessions(
    inviteId: string,
    userId: string,
    data: ExtendUserSessionsRequest
  ): Promise<any> {
    const response = await apiClient.patch<ApiResponseWrapper<any>>(
      `/session-invites/${inviteId}/users/${userId}/extend`,
      data
    );
    return response.data.data;
  }

  async getSessionStatus(params?: { token?: string; [key: string]: any }): Promise<any> {
    const response = await apiClient.get<ApiResponseWrapper<any>>('/session-invites/session-status', {
      params,
    });
    return response.data.data;
  }

  async verifyToken(data: VerifySessionTokenRequest): Promise<VerifySessionTokenResponse> {
    const response = await apiClient.post<ApiResponseWrapper<VerifySessionTokenResponse>>('/session-invites/verify', data);
    return response.data.data;
  }

  async startSessionWithJob(jobSubmissionId: string): Promise<StartSessionResponse> {
    const response = await apiClient.post<ApiResponseWrapper<StartSessionResponse>>('/session-invites/start-session', {
      job_submission_id: jobSubmissionId,
    });
    return response.data.data;
  }
}

export const sessionInvitesService = new SessionInvitesService();

