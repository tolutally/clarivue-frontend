import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import { Student } from "./list";

interface CreateStudentRequest {
  name: string;
  email: string;
  cohort?: string;
  enrollmentDate?: Date;
  advisorId?: number;
}

export const create = api<CreateStudentRequest, Student>(
  { expose: true, method: "POST", path: "/students" },
  async (req) => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM students WHERE email = ${req.email}
    `;

    if (existing) {
      throw APIError.alreadyExists("student with this email already exists");
    }

    if (req.advisorId) {
      const advisor = await db.queryRow<{ id: bigint }>`
        SELECT id FROM advisors WHERE id = ${req.advisorId}
      `;
      if (!advisor) {
        throw APIError.notFound("advisor not found");
      }
    }

    const row = await db.queryRow<any>`
      INSERT INTO students (name, email, cohort, enrollment_date, advisor_id)
      VALUES (${req.name}, ${req.email}, ${req.cohort || null}, ${req.enrollmentDate || null}, ${req.advisorId || null})
      RETURNING id, name, email, cohort, enrollment_date, advisor_id,
                readiness_score, technical_score, behavioral_score,
                created_at, updated_at
    `;

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
