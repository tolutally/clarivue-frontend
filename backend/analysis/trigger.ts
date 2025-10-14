import { api, APIError } from "encore.dev/api";
import log from "encore.dev/log";
import db from "../db";

interface TriggerAnalysisRequest {
  interviewId: number;
}

interface TriggerAnalysisResponse {
  success: boolean;
  message: string;
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

    await db.exec`
      INSERT INTO interview_analysis (interview_id, processed_at)
      VALUES (${req.interviewId}, NOW())
      ON CONFLICT (interview_id) DO UPDATE 
      SET processed_at = NOW()
    `;

    log.info("Analysis record created/updated", { interview_id: req.interviewId });

    return {
      success: true,
      message: "Analysis triggered successfully. AI processing will be implemented in Phase 2.",
    };
  }
);
