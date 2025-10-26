import { api, APIError } from "encore.dev/api";
import { db } from "../db";

interface DeleteInterviewRequest {
  id: number;
}

interface DeleteInterviewResponse {
  success: boolean;
}

export const deleteInterview = api<DeleteInterviewRequest, DeleteInterviewResponse>(
  { expose: true, method: "DELETE", path: "/interviews/:id" },
  async (req) => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM interviews WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("interview not found");
    }

    await db.exec`DELETE FROM interviews WHERE id = ${req.id}`;

    return { success: true };
  }
);
