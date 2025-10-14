import { api, APIError } from "encore.dev/api";
import log from "encore.dev/log";
import db from "../db";
import { analysis } from "~encore/clients";

interface TriggerAnalysisRequest {
  interviewId: number;
}

interface TriggerAnalysisResponse {
  success: boolean;
  message: string;
  analysisId?: number;
}

export const trigger = api<TriggerAnalysisRequest, TriggerAnalysisResponse>(
  { expose: true, method: "POST", path: "/analysis/trigger/:interviewId" },
  async (req) => {
    const interview = await db.queryRow<any>`
      SELECT id, student_id, transcript_url, status 
      FROM interviews 
      WHERE id = ${req.interviewId}
    `;

    if (!interview) {
      throw APIError.notFound("interview not found");
    }

    if (!interview.transcript_url) {
      throw APIError.failedPrecondition("interview does not have a transcript yet");
    }

    log.info("Manual analysis triggered", { interview_id: req.interviewId });

    try {
      const result = await analysis.process({ interviewId: req.interviewId });
      
      return {
        success: true,
        message: result.message,
        analysisId: result.analysisId
      };
    } catch (error) {
      log.error("Analysis processing failed", { interview_id: req.interviewId, error });
      throw APIError.internal("Failed to process interview analysis");
    }
  }
);
