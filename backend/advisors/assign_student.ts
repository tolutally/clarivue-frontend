import { api, APIError } from "encore.dev/api";
import { db } from "../db";

interface AssignStudentRequest {
  id: number;
  studentId: number;
}

interface AssignStudentResponse {
  success: boolean;
}

export const assignStudent = api<AssignStudentRequest, AssignStudentResponse>(
  { expose: true, method: "POST", path: "/advisors/:id/assign-student" },
  async (req) => {
    const advisor = await db.queryRow<{ id: bigint; capacity: number }>`
      SELECT id, capacity FROM advisors WHERE id = ${req.id}
    `;

    if (!advisor) {
      throw APIError.notFound("advisor not found");
    }

    const student = await db.queryRow<{ id: bigint }>`
      SELECT id FROM students WHERE id = ${req.studentId}
    `;

    if (!student) {
      throw APIError.notFound("student not found");
    }

    const studentCount = await db.queryRow<{ count: bigint }>`
      SELECT COUNT(*) as count FROM students WHERE advisor_id = ${req.id}
    `;

    if (Number(studentCount?.count || 0) >= advisor.capacity) {
      throw APIError.failedPrecondition("advisor has reached capacity");
    }

    await db.exec`
      UPDATE students 
      SET advisor_id = ${req.id}, updated_at = NOW() 
      WHERE id = ${req.studentId}
    `;

    return { success: true };
  }
);
