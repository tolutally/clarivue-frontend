import { api, APIError } from "encore.dev/api";
import { db } from "../db";
import { Interview } from "./list";

interface UpdateStatusRequest {
  id: number;
  status: string;
  recallBotId?: string;
  recallMeetingId?: string;
  transcriptUrl?: string;
  videoUrl?: string;
  duration?: number;
}

export const updateStatus = api<UpdateStatusRequest, Interview>(
  { expose: true, method: "PATCH", path: "/interviews/:id/status" },
  async (req) => {
    const existing = await db.queryRow<{ id: bigint }>`
      SELECT id FROM interviews WHERE id = ${req.id}
    `;

    if (!existing) {
      throw APIError.notFound("interview not found");
    }

    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    updates.push(`status = $${paramIndex}`);
    params.push(req.status);
    paramIndex++;

    if (req.recallBotId !== undefined) {
      updates.push(`recall_bot_id = $${paramIndex}`);
      params.push(req.recallBotId);
      paramIndex++;
    }

    if (req.recallMeetingId !== undefined) {
      updates.push(`recall_meeting_id = $${paramIndex}`);
      params.push(req.recallMeetingId);
      paramIndex++;
    }

    if (req.transcriptUrl !== undefined) {
      updates.push(`transcript_url = $${paramIndex}`);
      params.push(req.transcriptUrl);
      paramIndex++;
    }

    if (req.videoUrl !== undefined) {
      updates.push(`video_url = $${paramIndex}`);
      params.push(req.videoUrl);
      paramIndex++;
    }

    if (req.duration !== undefined) {
      updates.push(`duration = $${paramIndex}`);
      params.push(req.duration);
      paramIndex++;
    }

    if (req.status === 'recording' || req.status === 'processing') {
      updates.push(`conducted_at = NOW()`);
    }

    updates.push(`updated_at = NOW()`);

    const query = `
      UPDATE interviews 
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, student_id, recall_bot_id, recall_meeting_id,
                scheduled_at, conducted_at, duration, status,
                transcript_url, video_url, created_at, updated_at
    `;

    const row = await db.rawQueryRow<any>(query, ...params, req.id);

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
