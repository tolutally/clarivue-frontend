import apiClient from '../api/client';
import type { ApiResponseWrapper } from '@/services/api/types';

export interface CreateJobSubmissionRequest {
  job_title: string;
  job_description: string;
  company_name?: string;
  focus_areas?: string[];
}

export interface JobSubmission {
  id: string;
  job_title: string;
  job_description: string;
  company_name?: string;
  focus_areas?: string[];
  created_at: string;
  updated_at: string;
}

class JobSubmissionsService {
  async createJob(data: CreateJobSubmissionRequest): Promise<JobSubmission> {
    const response = await apiClient.post<ApiResponseWrapper<JobSubmission>>(
      '/job-submissions',
      data
    );
    return response.data.data;
  }

  async getJobs(page: number = 1, pageSize: number = 20): Promise<{
    jobs: JobSubmission[];
    total: number;
    page: number;
    page_size: number;
  }> {
    const response = await apiClient.get<ApiResponseWrapper<{
      jobs: JobSubmission[];
      total: number;
      page: number;
      page_size: number;
    }>>(`/job-submissions?page=${page}&page_size=${pageSize}`);
    return response.data.data;
  }

  async getJob(jobId: string): Promise<JobSubmission> {
    const response = await apiClient.get<ApiResponseWrapper<JobSubmission>>(
      `/job-submissions/${jobId}`
    );
    return response.data.data;
  }
}

export const jobSubmissionsService = new JobSubmissionsService();

