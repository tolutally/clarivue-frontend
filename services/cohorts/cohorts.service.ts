import apiClient from '../api/client';

export interface Cohort {
  id: string;
  name: string;
  description: string | null;
  tags: {
    term?: string;
    program?: string;
  };
  stats?: {
    invited: number;
    joined: number;
    started: number;
    completed: number;
  };
  lastActivity?: Date | null;
}

export interface CreateCohortRequest {
  name: string;
  description?: string;
  tags?: {
    term?: string;
    program?: string;
  };
}

export interface AddStudentsRequest {
  students: Array<{
    email: string;
    name: string;
  }>;
}

export interface SendInvitesRequest {
  studentIds: string[];
  timeLimit: number;
  numberOfInterviews: number;
}

class CohortsService {
  async list(): Promise<Cohort[]> {
    const response = await apiClient.get<Cohort[]>('/cohorts');
    return response.data;
  }

  async get(id: string): Promise<Cohort> {
    const response = await apiClient.get<Cohort>(`/cohorts/${id}`);
    return response.data;
  }

  async create(data: CreateCohortRequest): Promise<Cohort> {
    const response = await apiClient.post<Cohort>('/cohorts', data);
    return response.data;
  }

  async addStudents(cohortId: string, data: AddStudentsRequest): Promise<any> {
    const response = await apiClient.post(`/cohorts/${cohortId}/students`, data);
    return response.data;
  }

  async sendInvites(cohortId: string, data: SendInvitesRequest): Promise<any> {
    const response = await apiClient.post(`/cohorts/${cohortId}/invites`, data);
    return response.data;
  }
}

export const cohortsService = new CohortsService();

