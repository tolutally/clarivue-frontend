import apiClient from '../api/client';
import type { ApiResponseWrapper } from '../api/types';

export interface Program {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedProgramsResponse {
  items: Program[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListProgramsParams {
  search?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface CreateProgramRequest {
  name: string;
  is_global?: boolean;
}

export interface UpdateProgramRequest {
  name?: string;
  is_global?: boolean;
}

class ProgramsService {
  async list(params?: ListProgramsParams): Promise<PaginatedProgramsResponse> {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedProgramsResponse>>('/programs', {
      params,
    });
    return response.data.data;
  }

  async get(id: string): Promise<Program> {
    const response = await apiClient.get<ApiResponseWrapper<Program>>(`/programs/${id}`);
    return response.data.data;
  }

  async create(data: CreateProgramRequest): Promise<Program> {
    const response = await apiClient.post<ApiResponseWrapper<Program>>('/programs', data);
    return response.data.data;
  }

  async update(id: string, data: UpdateProgramRequest): Promise<Program> {
    const response = await apiClient.patch<ApiResponseWrapper<Program>>(`/programs/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/programs/${id}`);
  }
}

export const programsService = new ProgramsService();

