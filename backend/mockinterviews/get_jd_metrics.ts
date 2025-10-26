import { api } from "encore.dev/api";
import { db } from "../db";

export interface JDMetric {
  id: number;
  type: "technical_skill" | "soft_skill" | "competency" | "experience_level" | "responsibility";
  value: string;
  confidence: number;
  isStudentAdded: boolean;
}

export interface GetJDMetricsRequest {
  jdId: number;
}

export interface GetJDMetricsResponse {
  success: boolean;
  jobTitle?: string;
  companyName?: string;
  metrics?: JDMetric[];
  message?: string;
}

export const getJDMetrics = api(
  { expose: true, method: "POST", path: "/mockinterviews/get-jd-metrics" },
  async (req: GetJDMetricsRequest): Promise<GetJDMetricsResponse> => {
    const jd = await db.queryRow<{
      id: bigint;
      job_title: string | null;
      company_name: string | null;
    }>`
      SELECT id, job_title, company_name 
      FROM job_descriptions 
      WHERE id = ${req.jdId}
    `;

    if (!jd) {
      return {
        success: false,
        message: "Job description not found"
      };
    }

    const metricsRows = await db.queryAll<{
      id: bigint;
      metric_type: string;
      metric_value: string;
      confidence_score: number;
      is_student_added: boolean;
    }>`
      SELECT id, metric_type, metric_value, confidence_score, is_student_added
      FROM jd_extracted_metrics
      WHERE job_description_id = ${req.jdId}
      ORDER BY metric_type, is_student_added, metric_value
    `;

    return {
      success: true,
      jobTitle: jd.job_title || undefined,
      companyName: jd.company_name || undefined,
      metrics: metricsRows.map(row => ({
        id: Number(row.id),
        type: row.metric_type as any,
        value: row.metric_value,
        confidence: row.confidence_score,
        isStudentAdded: row.is_student_added
      }))
    };
  }
);
