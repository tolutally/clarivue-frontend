import type { ApiResponseWrapper } from '@/services/api/types';
import apiClient from '../api/client';

export interface AnalysisData {
  technicalDepthIndex: {
    score: number;
    rating: string;
    note: string;
  };
  technicalSkillsDetected: {
    languages: string[];
    tools: string[];
    methods: string[];
  };
  skillsMentioned: {
    languages: string[];
    tools: string[];
    methods: string[];
  };
  summaryNote: string;
  topStrengths: string[];
  areasOfConcern: string[];
  competencyBreakdown: Array<{
    competency: string;
    description: string;
    score: number;
    benchmark: number;
    evidence: string;
  }>;
  aiFeedbackSummary: string;
  technicalCoaching: string;
  personalizedRecommendations: string[];
}

export interface AnalysisResponse {
  id: string;
  session_log_id: string;
  user_id: string;
  analysis_data: AnalysisData;
  created_at: string;
  updated_at: string;
  analysis_version: string;
}

class AnalysisService {
  /**
   * Wait for analysis to be ready (polls until available)
   * Analysis is triggered automatically by the server when session closes.
   * This method polls until the analysis is ready.
   * @param sessionLogId - VirtualSessionLog ID
   * @param maxWaitMs - Maximum time to wait in milliseconds (default 60 seconds)
   * @param intervalMs - Polling interval in milliseconds (default 2 seconds)
   * @returns Analysis results
   * @throws Error if analysis not ready within timeout
   */
  async waitForAnalysis(
    sessionLogId: string,
    maxWaitMs: number = 60000,
    intervalMs: number = 2000
  ): Promise<AnalysisResponse> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitMs) {
      try {
        const analysis = await this.getAnalysis(sessionLogId);
        if (analysis) {
          return analysis;
        }
      } catch (error: any) {
        // Ignore 404 errors during polling, keep trying
        if (error?.response?.status === 404) {
          // Analysis not ready yet, continue polling
        } else {
          console.debug('Polling for analysis...', error.message);
        }
      }
      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }

    throw new Error('Analysis not ready. It may still be processing. Please try again later.');
  }

  /**
   * Get analysis results for a session
   * @param sessionLogId - VirtualSessionLog ID
   * @returns Analysis results or null if not available yet
   * @throws Error if fetch fails (except 404)
   */
  async getAnalysis(sessionLogId: string): Promise<AnalysisResponse | null> {
    try {
      const response = await apiClient.get<ApiResponseWrapper<AnalysisResponse>>(
        `/ai-sessions/analysis/${sessionLogId}`
      );
      return response.data.data;
    } catch (error: any) {
      // 404 means no analysis exists yet
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}

export const analysisService = new AnalysisService();

