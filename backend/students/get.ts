import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import { Student } from "./list";

interface GetStudentRequest {
  id: number;
}

export const get = api<GetStudentRequest, Student>(
  { expose: true, method: "GET", path: "/students/:id" },
  async (req) => {
    const row = await db.queryRow<any>`
      SELECT 
        id, name, email, cohort, enrollment_date, advisor_id,
        readiness_score, technical_score, behavioral_score,
        created_at, updated_at
      FROM students 
      WHERE id = ${req.id}
    `;

    if (!row) {
      throw APIError.notFound("student not found");
    }

    return {
      id: Number(row.id),
      name: row.name,
      email: row.email,
      cohort: row.cohort,
      enrollmentDate: row.enrollment_date,
      advisorId: row.advisor_id ? Number(row.advisor_id) : null,
      readinessScore: row.readiness_score,
      technicalScore: row.technical_score,
      behavioralScore: row.behavioral_score,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
);
