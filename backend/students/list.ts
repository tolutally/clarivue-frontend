import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { db } from "../db";

export interface Student {
  id: number;
  name: string;
  email: string;
  cohort: string | null;
  enrollmentDate: Date | null;
  advisorId: number | null;
  readinessScore: number | null;
  technicalScore: number | null;
  behavioralScore: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ListStudentsRequest {
  cohort?: Query<string>;
  advisorId?: Query<number>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListStudentsResponse {
  students: Student[];
  total: number;
}

export const list = api<ListStudentsRequest, ListStudentsResponse>(
  { expose: true, method: "GET", path: "/students" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;
    
    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (req.cohort) {
      whereConditions.push(`cohort = $${paramIndex}`);
      params.push(req.cohort);
      paramIndex++;
    }

    if (req.advisorId) {
      whereConditions.push(`advisor_id = $${paramIndex}`);
      params.push(req.advisorId);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const countQuery = `SELECT COUNT(*) as count FROM students ${whereClause}`;
    const countResult = await db.rawQueryRow<{ count: number }>(countQuery, ...params);
    const total = countResult?.count || 0;

    const query = `
      SELECT 
        id, name, email, cohort, enrollment_date, advisor_id,
        readiness_score, technical_score, behavioral_score,
        created_at, updated_at
      FROM students 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const rows = await db.rawQueryAll<any>(query, ...params, limit, offset);
    
    const students = rows.map(row => ({
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
    }));

    return { students, total };
  }
);
