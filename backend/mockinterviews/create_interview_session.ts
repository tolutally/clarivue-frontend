import { api } from "encore.dev/api";
import { db } from "../db";

export interface DevicePermissions {
  microphoneGranted: boolean;
  cameraGranted: boolean;
  microphoneTested: boolean;
  cameraTested: boolean;
}

export interface CreateInterviewSessionRequest {
  token: string;
  jdId: number;
  devicePermissions: DevicePermissions;
}

export interface CreateInterviewSessionResponse {
  success: boolean;
  interviewId?: number;
  sessionUrl?: string;
  message?: string;
}

export const createInterviewSession = api(
  { expose: true, method: "POST", path: "/mockinterviews/create-interview-session" },
  async (req: CreateInterviewSessionRequest): Promise<CreateInterviewSessionResponse> => {
    if (!req.devicePermissions.microphoneGranted) {
      return {
        success: false,
        message: "Microphone access is required to conduct the interview. Please enable it in your browser settings."
      };
    }

    const tokenData = await db.queryRow<{ student_id: bigint }>`
      SELECT student_id 
      FROM onboarding_tokens 
      WHERE token = ${req.token} AND expires_at > NOW()
    `;

    if (!tokenData) {
      return {
        success: false,
        message: "Invalid or expired token"
      };
    }

    const studentId = tokenData.student_id;

    const jdCheck = await db.queryRow<{ id: bigint }>`
      SELECT id 
      FROM job_descriptions 
      WHERE id = ${req.jdId} AND student_id = ${studentId}
    `;

    if (!jdCheck) {
      return {
        success: false,
        message: "Job description not found or access denied"
      };
    }

    const interviewResult = await db.queryRow<{ id: bigint }>`
      INSERT INTO interviews 
      (student_id, scheduled_date, status, metadata)
      VALUES (${studentId}, NOW(), 'scheduled', ${JSON.stringify({
        device_permissions: req.devicePermissions,
        jd_id: req.jdId
      })})
      RETURNING id
    `;

    const interviewId = interviewResult!.id;

    await db.exec`
      UPDATE job_descriptions 
      SET interview_id = ${interviewId} 
      WHERE id = ${req.jdId}
    `;

    await db.exec`
      UPDATE students 
      SET onboarding_completed = true 
      WHERE id = ${studentId}
    `;

    await db.exec`
      UPDATE onboarding_tokens 
      SET current_step = 'completed' 
      WHERE token = ${req.token}
    `;

    return {
      success: true,
      interviewId: Number(interviewId),
      sessionUrl: `/mockinterviews/session/${interviewId}`
    };
  }
);
