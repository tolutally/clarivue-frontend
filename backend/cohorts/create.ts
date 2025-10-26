import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { db } from "../db";

export interface CreateCohortRequest {
  name: string;
  description?: string;
  tags?: any;
  objectives?: string[];
}

export interface Cohort {
  id: string;
  name: string;
  description: string | null;
  tags: any;
  objectives: string[] | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const create = api<CreateCohortRequest, Cohort>(
  { auth: true, expose: true, method: "POST", path: "/cohorts" },
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
      INSERT INTO cohorts (name, description, owner_id, tags, objectives)
      VALUES (${req.name}, ${req.description || null}, ${BigInt(auth.adminID)}, ${JSON.stringify(req.tags || {})}, ${req.objectives || null})
      RETURNING id, name, description, owner_id, tags, objectives, created_at, updated_at
    `;

    if (!cohort) {
      throw new Error("Failed to create cohort");
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
