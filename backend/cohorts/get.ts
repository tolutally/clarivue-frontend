import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../db";

export interface GetCohortRequest {
  id: string;
}

export interface CohortDetails {
  id: string;
  name: string;
  description: string | null;
  tags: any;
  objectives: string[] | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const get = api<GetCohortRequest, CohortDetails>(
  { auth: true, expose: true, method: "GET", path: "/cohorts/:id" },
  async (req) => {
    const auth = getAuthData()!;

    const cohort = await db.queryRow<{
      id: bigint;
      name: string;
      description: string | null;
      tags: any;
      objectives: string[] | null;
      owner_id: bigint;
      created_at: Date;
      updated_at: Date;
    }>`
      SELECT id, name, description, tags, objectives, owner_id, created_at, updated_at
      FROM cohorts
      WHERE id = ${BigInt(req.id)} AND owner_id = ${BigInt(auth.adminID)} AND archived_at IS NULL
    `;

    if (!cohort) {
      throw APIError.notFound("cohort not found");
    }

    return {
      id: cohort.id.toString(),
      name: cohort.name,
      description: cohort.description,
      tags: cohort.tags,
      objectives: cohort.objectives,
      ownerId: cohort.owner_id.toString(),
      createdAt: cohort.created_at,
      updatedAt: cohort.updated_at,
    };
  }
);
