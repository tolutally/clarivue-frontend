import apiClient from '../api/client';

export interface Analysis {
  id: number;
  summary: string;
}

class AnalysisService {
  async get(interviewId: number): Promise<Analysis> {
    const response = await apiClient.get<Analysis>(`/analysis/${interviewId}`);
    return response.data;
  }
}

export const analysisService = new AnalysisService();

