import { api } from "encore.dev/api";
import { db } from "../db";

export interface SampleJD {
  id: number;
  category: string;
  jobTitle: string;
  companyType?: string;
  experienceLevel?: string;
  content: string;
}

export interface GetSampleJDsResponse {
  samples: SampleJD[];
}

export const getSampleJDs = api(
  { expose: true, method: "GET", path: "/mockinterviews/sample-jds" },
  async (): Promise<GetSampleJDsResponse> => {
    const rows = await db.queryAll<{
      id: bigint;
      category: string;
      job_title: string;
      company_type: string | null;
      experience_level: string | null;
      content: string;
    }>`
      SELECT id, category, job_title, company_type, experience_level, content
      FROM sample_job_descriptions
      WHERE is_active = true
      ORDER BY category, job_title
    `;

    return {
      samples: rows.map(row => ({
        id: Number(row.id),
        category: row.category,
        jobTitle: row.job_title,
        companyType: row.company_type || undefined,
        experienceLevel: row.experience_level || undefined,
        content: row.content
      }))
    };
  }
);
