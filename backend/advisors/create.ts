import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import { Advisor } from "./list";

interface CreateAdvisorRequest {
  name: string;
  email: string;
  avatarUrl?: string;
  specialization?: string;
  yearsExperience?: number;
  capacity?: number;
}

export const create = api<CreateAdvisorRequest, Advisor>(
  { expose: true, method: "POST", path: "/advisors" },
  async (req) => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM advisors WHERE email = ${req.email}
    `;

    if (existing) {
      throw APIError.alreadyExists("advisor with this email already exists");
    }

    const row = await db.queryRow<any>`
      INSERT INTO advisors (name, email, avatar_url, specialization, years_experience, capacity)
      VALUES (${req.name}, ${req.email}, ${req.avatarUrl || null}, ${req.specialization || null}, ${req.yearsExperience || null}, ${req.capacity || 10})
      RETURNING id, name, email, avatar_url, specialization, years_experience, capacity, created_at, updated_at
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
      studentCount: 0,
    };
  }
);
