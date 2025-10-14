import { api, APIError } from "encore.dev/api";
import db from "../db";
import { Interview } from "./list";

interface ListByStudentRequest {
  studentId: number;
}

interface ListByStudentResponse {
  interviews: Interview[];
}

export const listByStudent = api<ListByStudentRequest, ListByStudentResponse>(
  { expose: true, method: "GET", path: "/interviews/student/:studentId" },
  async (req) => {
    const student = await db.queryRow<{ id: bigint }>`
      SELECT id FROM students WHERE id = ${req.studentId}
    `;

    if (!student) {
      throw APIError.notFound("student not found");
    }

    const rows = await db.queryAll<any>`
      SELECT 
        id, student_id, recall_bot_id, recall_meeting_id,
        scheduled_at, conducted_at, duration, status,
        transcript_url, video_url, created_at, updated_at
      FROM interviews 
      WHERE student_id = ${req.studentId}
      ORDER BY created_at DESC
    `;

    const interviews = rows.map(row => ({
      id: Number(row.id),
      studentId: Number(row.student_id),
      recallBotId: row.recall_bot_id,
      recallMeetingId: row.recall_meeting_id,
      scheduledAt: row.scheduled_at,
      conductedAt: row.conducted_at,
      duration: row.duration,
      status: row.status,
      transcriptUrl: row.transcript_url,
      videoUrl: row.video_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { interviews };
  }
);
