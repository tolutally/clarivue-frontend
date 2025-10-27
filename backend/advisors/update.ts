import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import { Advisor } from "./list";

interface UpdateAdvisorRequest {
  id: number;
  name?: string;
  email?: string;
  avatarUrl?: string;
  specialization?: string;
  yearsExperience?: number;
  capacity?: number;
}

export const update = api<UpdateAdvisorRequest, Advisor>(
  { expose: true, method: "PATCH", path: "/advisors/:id" },
  async (req): Promise<Advisor> => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM advisors WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("advisor not found");
    }

    if (req.email) {
      const emailConflict = await db.queryRow<{ id: bigint }>`
        SELECT id FROM advisors WHERE email = ${req.email} AND id != ${req.id}
      `;
      if (emailConflict) {
        throw APIError.alreadyExists("advisor with this email already exists");
      }
    }

    const updates: string[] = [];
    const params: (string | number | null)[] = [];
    let paramIndex = 1;

    if (req.name !== undefined) {
      updates.push(`name = $${paramIndex}`);
      params.push(req.name);
      paramIndex++;
    }
    if (req.email !== undefined) {
      updates.push(`email = $${paramIndex}`);
      params.push(req.email);
      paramIndex++;
    }
    if (req.avatarUrl !== undefined) {
      updates.push(`avatar_url = $${paramIndex}`);
      params.push(req.avatarUrl);
      paramIndex++;
    }
    if (req.specialization !== undefined) {
      updates.push(`specialization = $${paramIndex}`);
      params.push(req.specialization);
      paramIndex++;
    }
    if (req.yearsExperience !== undefined) {
      updates.push(`years_experience = $${paramIndex}`);
      params.push(req.yearsExperience);
      paramIndex++;
    }
    if (req.capacity !== undefined) {
      updates.push(`capacity = $${paramIndex}`);
      params.push(req.capacity);
      paramIndex++;
    }

    updates.push(`updated_at = NOW()`);

    const query = `
      UPDATE advisors 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, email, avatar_url, specialization, years_experience, capacity, created_at, updated_at
    `;

    const row = await db.rawQueryRow<any>(query, ...params, req.id);

    const studentCount = await db.queryRow<{ count: bigint }>`
      SELECT COUNT(*) as count FROM students WHERE advisor_id = ${req.id}
    `;

    return {
      id: Number(row!.id),
      name: row!.name,
      email: row!.email,
      avatarUrl: row!.avatar_url,
      specialization: row!.specialization,
      yearsExperience: row!.years_experience,
      capacity: row!.capacity,
      createdAt: row!.created_at,
      updatedAt: row!.updated_at,
      studentCount: Number(studentCount?.count || 0),
    };
  }
);
