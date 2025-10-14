import { api, APIError } from "encore.dev/api";
import db from "../db";
import { Advisor } from "./list";

interface GetAdvisorRequest {
  id: number;
}

export const get = api<GetAdvisorRequest, Advisor>(
  { expose: true, method: "GET", path: "/advisors/:id" },
  async (req) => {
    const row = await db.queryRow<any>`
      SELECT 
        a.id, a.name, a.email, a.avatar_url, a.specialization, 
        a.years_experience, a.capacity, a.created_at, a.updated_at,
        COUNT(s.id) as student_count
      FROM advisors a
      LEFT JOIN students s ON s.advisor_id = a.id
      WHERE a.id = ${req.id}
      GROUP BY a.id, a.name, a.email, a.avatar_url, a.specialization, 
               a.years_experience, a.capacity, a.created_at, a.updated_at
    `;

    if (!row) {
      throw APIError.notFound("advisor not found");
    }

    return {
      id: Number(row.id),
      name: row.name,
      email: row.email,
      avatarUrl: row.avatar_url,
      specialization: row.specialization,
      yearsExperience: row.years_experience,
      capacity: row.capacity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      studentCount: Number(row.student_count),
    };
  }
);
