import { api, APIError } from "encore.dev/api";
import db from "../db";

interface DeleteStudentRequest {
  id: number;
}

interface DeleteStudentResponse {
  success: boolean;
}

export const deleteStudent = api<DeleteStudentRequest, DeleteStudentResponse>(
  { expose: true, method: "DELETE", path: "/students/:id" },
  async (req) => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM students WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("student not found");
    }

    await db.exec`DELETE FROM students WHERE id = ${req.id}`;

    return { success: true };
  }
);
