import { api, APIError } from "encore.dev/api";
import { db } from "../db";

interface DeleteAdvisorRequest {
  id: number;
}

interface DeleteAdvisorResponse {
  success: boolean;
}

export const deleteAdvisor = api<DeleteAdvisorRequest, DeleteAdvisorResponse>(
  { expose: true, method: "DELETE", path: "/advisors/:id" },
  async (req) => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM advisors WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("advisor not found");
    }

    await db.exec`DELETE FROM advisors WHERE id = ${req.id}`;

    return { success: true };
  }
);
