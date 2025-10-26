import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import { Interview } from "./list";

interface CreateInterviewRequest {
  studentId: number;
  recallBotId?: string;
  scheduledAt?: Date;
}

export const create = api<CreateInterviewRequest, Interview>(
  { expose: true, method: "POST", path: "/interviews" },
  async (req) => {
    const student = await db.queryRow<{ id: bigint }>`
      SELECT id FROM students WHERE id = ${req.studentId}
    `;

    if (!student) {
      throw APIError.notFound("student not found");
    }

    const row = await db.queryRow<any>`
      INSERT INTO interviews (student_id, recall_bot_id, scheduled_at, status)
      VALUES (${req.studentId}, ${req.recallBotId || null}, ${req.scheduledAt || null}, 'scheduled')
      RETURNING id, student_id, recall_bot_id, recall_meeting_id,
                scheduled_at, conducted_at, duration, status,
                transcript_url, video_url, created_at, updated_at
    `;

    return {
      id: Number(row!.id),
      studentId: Number(row!.student_id),
      recallBotId: row!.recall_bot_id,
      recallMeetingId: row!.recall_meeting_id,
      scheduledAt: row!.scheduled_at,
      conductedAt: row!.conducted_at,
      duration: row!.duration,
      status: row!.status,
      transcriptUrl: row!.transcript_url,
      videoUrl: row!.video_url,
      createdAt: row!.created_at,
      updatedAt: row!.updated_at,
    };
  }
);
