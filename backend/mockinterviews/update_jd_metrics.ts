import { api } from "encore.dev/api";
import { db } from "../db";

export interface UpdateJDMetricsRequest {
  jdId: number;
  additions: Array<{
    type: "technical_skill" | "soft_skill";
    value: string;
  }>;
}

export interface UpdateJDMetricsResponse {
  success: boolean;
  message?: string;
}

export const updateJDMetrics = api(
  { expose: true, method: "POST", path: "/mockinterviews/update-jd-metrics" },
  async (req: UpdateJDMetricsRequest): Promise<UpdateJDMetricsResponse> => {
    if (req.additions.length === 0) {
      return { success: true };
    }

    const jdCheck = await db.queryRow<{ id: bigint }>`
      SELECT id FROM job_descriptions WHERE id = ${req.jdId}
    `;

    if (!jdCheck) {
      return {
        success: false,
        message: "Job description not found"
      };
    }

    for (const addition of req.additions) {
      await db.exec`
        INSERT INTO jd_extracted_metrics 
        (job_description_id, metric_type, metric_value, confidence_score, is_student_added)
        VALUES (${req.jdId}, ${addition.type}, ${addition.value}, 1.0, true)
      `;
    }

    return { success: true };
  }
);
