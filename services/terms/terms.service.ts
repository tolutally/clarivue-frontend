import apiClient from '../api/client';
import type { ApiResponseWrapper } from '../api/types';

export interface Term {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedTermsResponse {
  items: Term[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListTermsParams {
  search?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface CreateTermRequest {
  name: string;
  is_global?: boolean;
}

export interface UpdateTermRequest {
  name?: string;
  is_global?: boolean;
}

class TermsService {
  async list(params?: ListTermsParams): Promise<PaginatedTermsResponse> {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedTermsResponse>>('/terms', {
      params,
    });
    return response.data.data;
  }

  async get(id: string): Promise<Term> {
    const response = await apiClient.get<ApiResponseWrapper<Term>>(`/terms/${id}`);
    return response.data.data;
  }

  async create(data: CreateTermRequest): Promise<Term> {
    const response = await apiClient.post<ApiResponseWrapper<Term>>('/terms', data);
    return response.data.data;
  }

  async update(id: string, data: UpdateTermRequest): Promise<Term> {
    const response = await apiClient.patch<ApiResponseWrapper<Term>>(`/terms/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/terms/${id}`);
  }
}

export const termsService = new TermsService();

