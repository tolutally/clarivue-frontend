import apiClient from '../api/client';
import type { ApiResponseWrapper } from '../api/types';

export interface Objective {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedObjectivesResponse {
  items: Objective[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListObjectivesParams {
  search?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface CreateObjectiveRequest {
  name: string;
  is_global?: boolean;
}

export interface UpdateObjectiveRequest {
  name?: string;
  is_global?: boolean;
}

class ObjectivesService {
  async list(params?: ListObjectivesParams): Promise<PaginatedObjectivesResponse> {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedObjectivesResponse>>('/objectives', {
      params,
    });
    return response.data.data;
  }

  async get(id: string): Promise<Objective> {
    const response = await apiClient.get<ApiResponseWrapper<Objective>>(`/objectives/${id}`);
    return response.data.data;
  }

  async create(data: CreateObjectiveRequest): Promise<Objective> {
    const response = await apiClient.post<ApiResponseWrapper<Objective>>('/objectives', data);
    return response.data.data;
  }

  async update(id: string, data: UpdateObjectiveRequest): Promise<Objective> {
    const response = await apiClient.patch<ApiResponseWrapper<Objective>>(`/objectives/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/objectives/${id}`);
  }
}

export const objectivesService = new ObjectivesService();

