import apiClient from '../api/client';
import type { ApiResponseWrapper } from '../api/types';

export interface CustomTag {
  _id: string;
  name: string;
  is_global: boolean;
  company: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginatedCustomTagsResponse {
  items: CustomTag[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListCustomTagsParams {
  search?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface CreateCustomTagRequest {
  name: string;
  is_global?: boolean;
}

export interface UpdateCustomTagRequest {
  name?: string;
  is_global?: boolean;
}

class CustomTagsService {
  async list(params?: ListCustomTagsParams): Promise<PaginatedCustomTagsResponse> {
    const response = await apiClient.get<ApiResponseWrapper<PaginatedCustomTagsResponse>>('/custom-tags', {
      params,
    });
    return response.data.data;
  }

  async get(id: string): Promise<CustomTag> {
    const response = await apiClient.get<ApiResponseWrapper<CustomTag>>(`/custom-tags/${id}`);
    return response.data.data;
  }

  async create(data: CreateCustomTagRequest): Promise<CustomTag> {
    const response = await apiClient.post<ApiResponseWrapper<CustomTag>>('/custom-tags', data);
    return response.data.data;
  }

  async update(id: string, data: UpdateCustomTagRequest): Promise<CustomTag> {
    const response = await apiClient.patch<ApiResponseWrapper<CustomTag>>(`/custom-tags/${id}`, data);
    return response.data.data;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/custom-tags/${id}`);
  }
}

export const customTagsService = new CustomTagsService();

