import apiClient from '../api/client';

// API Response Wrapper
interface ApiResponseWrapper<T> {
  status_code: number;
  message: string;
  data: T;
  error: null | any;
}

// Term type
export interface Term {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

// Program type
export interface Program {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

// Custom Tag type
export interface CustomTag {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

// Objective type
export interface Objective {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

// Cohort type matching API response
export interface Cohort {
  _id: string;
  name: string;
  description: string;
  term: Term;
  program: Program;
  custom_tags: CustomTag[];
  objectives: Objective[];
  company: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  member_count: number;
  session_invite_count: number;
}

// Paginated response
export interface PaginatedCohortsResponse {
  items: Cohort[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Query parameters for listing cohorts
export interface ListCohortsParams {
  search?: string;
  term_id?: string;
  program_id?: string;
  company_id?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

// Create cohort request
export interface CreateCohortRequest {
  name: string;
  description?: string;
  term_id?: string;
  program_id?: string;
  custom_tag_ids?: string[];
  objective_ids?: string[];
  company_id: string;
}

// Update cohort request
export interface UpdateCohortRequest {
  name?: string;
  description?: string;
  term_id?: string;
  program_id?: string;
  custom_tag_ids?: string[];
  objective_ids?: string[];
}

// Bulk add users request
export interface BulkAddUsersRequest {
  users: Array<{
    email: string;
    first_name: string;
    last_name: string;
  }>;
}

// Cohort Member type
export interface CohortMember {
  _id: string;
  cohort: string;
  user: {
    _id: string;
    name: string;
    email: string;
    company: string | null;
    role: {
      _id: string;
      name: string;
      permissions: any[];
    };
  };
  created_at: string;
  updated_at: string;
}

// Paginated members response
export interface PaginatedMembersResponse {
  items: CohortMember[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Get cohort members params
export interface GetCohortMembersParams {
  search?: string;
  sort_by?: 'created_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

class CohortsService {
  async list(params?: ListCohortsParams): Promise<PaginatedCohortsResponse> {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedCohortsResponse>>('/cohorts', {
      params,
    });
    return response.data.data;
  }

  async get(id: string): Promise<Cohort> {
    const response = await apiClient.get<ApiResponseWrapper<Cohort>>(`/cohorts/${id}`);
    return response.data.data;
  }

  async create(data: CreateCohortRequest): Promise<Cohort> {
    const response = await apiClient.post<ApiResponseWrapper<Cohort>>('/cohorts', data);
    return response.data.data;
  }

  async update(id: string, data: UpdateCohortRequest): Promise<Cohort> {
    const response = await apiClient.patch<ApiResponseWrapper<Cohort>>(`/cohorts/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/cohorts/${id}`);
  }

  async bulkAddUsers(cohortId: string, data: BulkAddUsersRequest): Promise<any> {
    const response = await apiClient.post<ApiResponseWrapper<any>>(`/cohorts/${cohortId}/members`, data);
    return response.data.data;
  }

  async getMembers(cohortId: string, params?: GetCohortMembersParams): Promise<PaginatedMembersResponse> {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedMembersResponse>>(`/cohorts/${cohortId}/members`, {
      params,
    });
    return response.data.data;
  }

  async removeMember(cohortId: string, userId: string): Promise<void> {
    await apiClient.delete(`/cohorts/${cohortId}/members/${userId}`);
  }
}

export const cohortsService = new CohortsService();

