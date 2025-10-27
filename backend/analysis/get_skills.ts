import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import type { SkillContextSnippets } from "../types/analysis";

export interface SkillDetected {
  id: number;
  interviewId: number;
  skillName: string;
  category: string | null;
  confidenceScore: number | null;
  mentionedCount: number;
  contextSnippets: SkillContextSnippets;
  createdAt: Date;
}

interface GetSkillsRequest {
  interviewId: number;
}

interface GetSkillsResponse {
  skills: SkillDetected[];
}

export const getSkills = api<GetSkillsRequest, GetSkillsResponse>(
  { expose: true, method: "GET", path: "/analysis/:interviewId/skills" },
  async (req): Promise<GetSkillsResponse> => {
    const interview = await db.queryRow<{ id: bigint }>`
      SELECT id FROM interviews WHERE id = ${req.interviewId}
    `;

    if (!interview) {
      throw APIError.notFound("interview not found");
    }

    const rows = await db.queryAll<{
      id: bigint;
      interview_id: bigint;
      skill_name: string;
      category: string | null;
      confidence_score: number | null;
      mentioned_count: number;
      context_snippets: SkillContextSnippets;
      created_at: Date;
    }>`
      SELECT 
        id, interview_id, skill_name, category, confidence_score,
        mentioned_count, context_snippets, created_at
      FROM skills_detected 
      WHERE interview_id = ${req.interviewId}
      ORDER BY confidence_score DESC NULLS LAST, mentioned_count DESC
    `;

    const skills = rows.map(row => ({
      id: Number(row.id),
      interviewId: Number(row.interview_id),
      skillName: row.skill_name,
      category: row.category,
      confidenceScore: row.confidence_score,
      mentionedCount: row.mentioned_count,
      contextSnippets: row.context_snippets,
      createdAt: row.created_at,
    }));

    return { skills };
  }
);
