import { api, APIError } from "encore.dev/api";
import db from "../db";
import { Interview } from "./list";

interface GetInterviewRequest {
  id: number;
}

export const get = api<GetInterviewRequest, Interview>(
  { expose: true, method: "GET", path: "/interviews/:id" },
  async (req) => {
    const row = await db.queryRow<any>`
      SELECT 
        id, student_id, recall_bot_id, recall_meeting_id,
        scheduled_at, conducted_at, duration, status,
        transcript_url, video_url, created_at, updated_at
      FROM interviews 
      WHERE id = ${req.id}
    `;

    if (!row) {
      throw APIError.notFound("interview not found");
    }

    return {
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
    };
  }
);
