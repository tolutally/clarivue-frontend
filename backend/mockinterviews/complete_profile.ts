import { api } from "encore.dev/api";
import { db } from "../db";

export interface CareerPursuit {
  targetRole: string;
  industryPreference?: string;
  expectedGraduation?: string;
  skillLevel: "beginner" | "intermediate" | "advanced";
}

export interface CompleteProfileRequest {
  token: string;
  phoneNumber?: string;
  careerPursuit: CareerPursuit;
}

export interface CompleteProfileResponse {
  success: boolean;
  message?: string;
}

export const completeProfile = api(
  { expose: true, method: "POST", path: "/mockinterviews/complete-profile" },
  async (req: CompleteProfileRequest): Promise<CompleteProfileResponse> => {
    if (req.token === "demo-token") {
      return { success: true };
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
    const graduationDate = req.careerPursuit.expectedGraduation 
      ? new Date(req.careerPursuit.expectedGraduation) 
      : null;

    await db.exec`
      UPDATE students 
      SET phone_number = ${req.phoneNumber || null},
          target_role = ${req.careerPursuit.targetRole},
          industry_preference = ${req.careerPursuit.industryPreference || null},
          expected_graduation = ${graduationDate},
          skill_level = ${req.careerPursuit.skillLevel}
      WHERE id = ${studentId}
    `;

    await db.exec`
      UPDATE onboarding_tokens 
      SET current_step = 'consent' 
      WHERE token = ${req.token}
    `;

    return {
      success: true
    };
  }
);
