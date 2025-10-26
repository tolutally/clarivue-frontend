import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { db } from "../db";

export interface Interview {
  id: number;
  studentId: number;
  recallBotId: string | null;
  recallMeetingId: string | null;
  scheduledAt: Date | null;
  conductedAt: Date | null;
  duration: number | null;
  status: string;
  transcriptUrl: string | null;
  videoUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ListInterviewsRequest {
  studentId?: Query<number>;
  status?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListInterviewsResponse {
  interviews: Interview[];
  total: number;
}

export const list = api<ListInterviewsRequest, ListInterviewsResponse>(
  { expose: true, method: "GET", path: "/interviews" },
  async (req) => {
    const limit = req.limit || 50;
    const offset = req.offset || 0;
    
    let whereConditions: string[] = [];
    let params: any[] = [];
    let paramIndex = 1;

    if (req.studentId) {
      whereConditions.push(`student_id = $${paramIndex}`);
      params.push(req.studentId);
      paramIndex++;
    }

    if (req.status) {
      whereConditions.push(`status = $${paramIndex}`);
      params.push(req.status);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const countQuery = `SELECT COUNT(*) as count FROM interviews ${whereClause}`;
    const countResult = await db.rawQueryRow<{ count: number }>(countQuery, ...params);
    const total = countResult?.count || 0;

    const query = `
      SELECT 
        id, student_id, recall_bot_id, recall_meeting_id,
        scheduled_at, conducted_at, duration, status,
        transcript_url, video_url, created_at, updated_at
      FROM interviews 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    
    const rows = await db.rawQueryAll<any>(query, ...params, limit, offset);
    
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

    return { interviews, total };
  }
);
