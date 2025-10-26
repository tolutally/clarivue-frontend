import { api } from "encore.dev/api";
import { db } from "../db";

export interface Advisor {
  id: number;
  name: string;
  email: string;
  avatarUrl: string | null;
  specialization: string | null;
  yearsExperience: number | null;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
  studentCount?: number;
}

interface ListAdvisorsResponse {
  advisors: Advisor[];
}

export const list = api<void, ListAdvisorsResponse>(
  { expose: true, method: "GET", path: "/advisors" },
  async () => {
    const rows = await db.queryAll<any>`
      SELECT 
        a.id, a.name, a.email, a.avatar_url, a.specialization, 
        a.years_experience, a.capacity, a.created_at, a.updated_at,
        COUNT(s.id) as student_count
      FROM advisors a
      LEFT JOIN students s ON s.advisor_id = a.id
      GROUP BY a.id, a.name, a.email, a.avatar_url, a.specialization, 
               a.years_experience, a.capacity, a.created_at, a.updated_at
      ORDER BY a.created_at DESC
    `;

    const advisors = rows.map(row => ({
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
    }));

    return { advisors };
  }
);
