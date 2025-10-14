import { api, APIError } from "encore.dev/api";
import db from "../db";

export interface Competency {
  id: number;
  interviewId: number;
  competencyName: string;
  score: number;
  evidence: string | null;
  createdAt: Date;
}

interface GetCompetenciesRequest {
  interviewId: number;
}

interface GetCompetenciesResponse {
  competencies: Competency[];
}

export const getCompetencies = api<GetCompetenciesRequest, GetCompetenciesResponse>(
  { expose: true, method: "GET", path: "/analysis/:interviewId/competencies" },
  async (req) => {
    const interview = await db.queryRow<{ id: bigint }>`
      SELECT id FROM interviews WHERE id = ${req.interviewId}
    `;

    if (!interview) {
      throw APIError.notFound("interview not found");
    }

    const rows = await db.queryAll<any>`
      SELECT 
        id, interview_id, competency_name, score, evidence, created_at
      FROM competencies 
      WHERE interview_id = ${req.interviewId}
      ORDER BY score DESC
    `;

    const competencies = rows.map(row => ({
      id: Number(row.id),
      interviewId: Number(row.interview_id),
      competencyName: row.competency_name,
      score: row.score,
      evidence: row.evidence,
      createdAt: row.created_at,
    }));

    return { competencies };
  }
);
