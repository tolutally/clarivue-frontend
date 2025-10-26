import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import { Student } from "./list";

interface UpdateStudentRequest {
  id: number;
  name?: string;
  email?: string;
  cohort?: string;
  enrollmentDate?: Date;
  advisorId?: number;
  readinessScore?: number;
  technicalScore?: number;
  behavioralScore?: number;
}

export const update = api<UpdateStudentRequest, Student>(
  { expose: true, method: "PATCH", path: "/students/:id" },
  async (req) => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM students WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("student not found");
    }

    if (req.email) {
      const emailConflict = await db.queryRow<{ id: bigint }>`
        SELECT id FROM students WHERE email = ${req.email} AND id != ${req.id}
      `;
      if (emailConflict) {
        throw APIError.alreadyExists("student with this email already exists");
      }
    }

    if (req.advisorId) {
      const advisor = await db.queryRow<{ id: bigint }>`
        SELECT id FROM advisors WHERE id = ${req.advisorId}
      `;
      if (!advisor) {
        throw APIError.notFound("advisor not found");
      }
    }

    const updates: string[] = [];
    const params: any[] = [];
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
    if (req.cohort !== undefined) {
      updates.push(`cohort = $${paramIndex}`);
      params.push(req.cohort);
      paramIndex++;
    }
    if (req.enrollmentDate !== undefined) {
      updates.push(`enrollment_date = $${paramIndex}`);
      params.push(req.enrollmentDate);
      paramIndex++;
    }
    if (req.advisorId !== undefined) {
      updates.push(`advisor_id = $${paramIndex}`);
      params.push(req.advisorId);
      paramIndex++;
    }
    if (req.readinessScore !== undefined) {
      updates.push(`readiness_score = $${paramIndex}`);
      params.push(req.readinessScore);
      paramIndex++;
    }
    if (req.technicalScore !== undefined) {
      updates.push(`technical_score = $${paramIndex}`);
      params.push(req.technicalScore);
      paramIndex++;
    }
    if (req.behavioralScore !== undefined) {
      updates.push(`behavioral_score = $${paramIndex}`);
      params.push(req.behavioralScore);
      paramIndex++;
    }

    updates.push(`updated_at = NOW()`);

    const query = `
      UPDATE students 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, name, email, cohort, enrollment_date, advisor_id,
                readiness_score, technical_score, behavioral_score,
                created_at, updated_at
    `;

    const row = await db.rawQueryRow<any>(query, ...params, req.id);

    return {
      id: Number(row!.id),
      name: row!.name,
      email: row!.email,
      cohort: row!.cohort,
      enrollmentDate: row!.enrollment_date,
      advisorId: row!.advisor_id ? Number(row!.advisor_id) : null,
      readinessScore: row!.readiness_score,
      technicalScore: row!.technical_score,
      behavioralScore: row!.behavioral_score,
      createdAt: row!.created_at,
      updatedAt: row!.updated_at,
    };
  }
);
