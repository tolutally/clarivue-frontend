import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import type { SentimentScores } from "../types/analysis";

export interface InterviewAnalysis {
  id: number;
  interviewId: number;
  overallReadinessScore: number | null;
  technicalDepthIndex: number | null;
  authenticityScore: number | null;
  strengths: string[];
  concerns: string[];
  aiSummary: string | null;
  aiRecommendations: string | null;
  sentimentScores: SentimentScores | null;
  processedAt: Date;
}

interface GetAnalysisRequest {
  interviewId: number;
}

export const get = api<GetAnalysisRequest, InterviewAnalysis>(
  { expose: true, method: "GET", path: "/analysis/:interviewId" },
  async (req): Promise<InterviewAnalysis> => {
    const row = await db.queryRow<{
      id: bigint;
      interview_id: bigint;
      overall_readiness_score: number | null;
      technical_depth_index: number | null;
      authenticity_score: number | null;
      strengths: string[] | null;
      concerns: string[] | null;
      ai_summary: string | null;
      ai_recommendations: string | null;
      sentiment_scores: SentimentScores | null;
      processed_at: Date;
    }>`
      SELECT 
        id, interview_id, overall_readiness_score, technical_depth_index,
        authenticity_score, strengths, concerns, ai_summary, ai_recommendations,
        sentiment_scores, processed_at
      FROM interview_analysis 
      WHERE interview_id = ${req.interviewId}
    `;

    if (!row) {
      throw APIError.notFound("analysis not found for this interview");
    }

    return {
      id: Number(row.id),
      interviewId: Number(row.interview_id),
      overallReadinessScore: row.overall_readiness_score,
      technicalDepthIndex: row.technical_depth_index,
      authenticityScore: row.authenticity_score,
      strengths: row.strengths || [],
      concerns: row.concerns || [],
      aiSummary: row.ai_summary,
      aiRecommendations: row.ai_recommendations,
      sentimentScores: row.sentiment_scores,
      processedAt: row.processed_at,
    };
  }
);
