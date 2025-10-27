import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../db";
import type { CohortTags } from "../types/cohort";

export interface CohortSummary {
  id: string;
  name: string;
  description: string | null;
  tags: CohortTags;
  objectives: string[] | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  stats: {
    invited: number;
    joined: number;
    started: number;
    completed: number;
  };
  lastActivity: Date | null;
}

export interface ListCohortsResponse {
  cohorts: CohortSummary[];
}

export const list = api<void, ListCohortsResponse>(
  { auth: true, expose: true, method: "GET", path: "/cohorts" },
  async (): Promise<ListCohortsResponse> => {
    const auth = getAuthData()!;

    const rows = [];
    for await (const row of db.query<{
      id: bigint;
      name: string;
      description: string | null;
      tags: CohortTags;
      objectives: string[] | null;
      owner_id: bigint;
      created_at: Date;
      updated_at: Date;
      invited: bigint;
      joined: bigint;
      started: bigint;
      completed: bigint;
      last_activity: Date | null;
    }>`
      SELECT 
        c.id,
        c.name,
        c.description,
        c.tags,
        c.objectives,
        c.owner_id,
        c.created_at,
        c.updated_at,
        COUNT(cs.id) as invited,
        COUNT(cs.id) FILTER (WHERE cs.joined_at IS NOT NULL) as joined,
        COUNT(cs.id) FILTER (WHERE cs.joined_at IS NOT NULL AND EXISTS (
          SELECT 1 FROM interviews i WHERE i.student_id = cs.student_id
        )) as started,
        COUNT(cs.id) FILTER (WHERE cs.joined_at IS NOT NULL) as completed,
        MAX(cs.last_active_at) as last_activity
      FROM cohorts c
      LEFT JOIN cohort_students cs ON c.id = cs.cohort_id
      WHERE c.owner_id = ${BigInt(auth.adminID)} AND c.archived_at IS NULL
      GROUP BY c.id
      ORDER BY COALESCE(MAX(cs.last_active_at), c.updated_at) DESC
    `) {
      rows.push(row);
    }

    return {
      cohorts: rows.map((c) => ({
        id: c.id.toString(),
        name: c.name,
        description: c.description,
        tags: c.tags,
        objectives: c.objectives,
        ownerId: c.owner_id.toString(),
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        stats: {
          invited: Number(c.invited),
          joined: Number(c.joined),
          started: Number(c.started),
          completed: Number(c.completed),
        },
        lastActivity: c.last_activity,
      })),
    };
  }
);
