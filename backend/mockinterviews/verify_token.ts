import { api } from "encore.dev/api";
import { db } from "../db";

export interface VerifyTokenRequest {
  token: string;
}

export interface StudentInfo {
  id: number;
  name: string;
  email: string;
  institution?: string;
  cohortName?: string;
  phoneNumber?: string;
  targetRole?: string;
  industryPreference?: string;
  expectedGraduation?: string;
  skillLevel?: string;
}

export interface VerifyTokenResponse {
  valid: boolean;
  student?: StudentInfo;
  currentStep?: string;
  message?: string;
}

export const verifyToken = api(
  { expose: true, method: "POST", path: "/mockinterviews/verify-token" },
  async (req: VerifyTokenRequest): Promise<VerifyTokenResponse> => {
    if (req.token === "demo-token") {
      return {
        valid: true,
        currentStep: "welcome",
        student: {
          id: 999,
          name: "Demo User",
          email: "demo@example.com",
          cohortName: "Demo Cohort"
        }
      };
    }

    const tokenData = await db.queryRow<{
      id: bigint;
      student_id: bigint;
      expires_at: Date;
      used_at: Date | null;
      current_step: string;
    }>`
      SELECT id, student_id, expires_at, used_at, current_step 
      FROM onboarding_tokens 
      WHERE token = ${req.token}
    `;

    if (!tokenData) {
      return {
        valid: false,
        message: "Invalid or expired invite link. Please request a new invite."
      };
    }

    if (new Date() > new Date(tokenData.expires_at)) {
      return {
        valid: false,
        message: "This invite link has expired. Please request a new invite."
      };
    }

    const student = await db.queryRow<{
      id: bigint;
      name: string;
      email: string;
      institution: string | null;
      cohort_name: string | null;
      phone_number: string | null;
      target_role: string | null;
      industry_preference: string | null;
      expected_graduation: Date | null;
      skill_level: string | null;
      onboarding_completed: boolean;
    }>`
      SELECT s.id, s.name, s.email, s.institution, c.name as cohort_name,
             s.phone_number, s.target_role, s.industry_preference, 
             s.expected_graduation, s.skill_level, s.onboarding_completed
      FROM students s
      LEFT JOIN cohorts c ON s.cohort_id = c.id
      WHERE s.id = ${tokenData.student_id}
    `;

    if (!student) {
      return {
        valid: false,
        message: "Student account not found. Please contact support."
      };
    }

    if (student.onboarding_completed) {
      return {
        valid: true,
        currentStep: "completed",
        message: "You've already completed onboarding. Redirecting to dashboard...",
        student: {
          id: Number(student.id),
          name: student.name,
          email: student.email,
          institution: student.institution || undefined,
          cohortName: student.cohort_name || undefined,
          phoneNumber: student.phone_number || undefined,
          targetRole: student.target_role || undefined,
          industryPreference: student.industry_preference || undefined,
          expectedGraduation: student.expected_graduation?.toISOString().split('T')[0],
          skillLevel: student.skill_level || undefined
        }
      };
    }

    await db.exec`
      UPDATE onboarding_tokens 
      SET used_at = NOW() 
      WHERE id = ${tokenData.id} AND used_at IS NULL
    `;

    return {
      valid: true,
      currentStep: tokenData.current_step,
      student: {
        id: Number(student.id),
        name: student.name,
        email: student.email,
        institution: student.institution || undefined,
        cohortName: student.cohort_name || undefined,
        phoneNumber: student.phone_number || undefined,
        targetRole: student.target_role || undefined,
        industryPreference: student.industry_preference || undefined,
        expectedGraduation: student.expected_graduation?.toISOString().split('T')[0],
        skillLevel: student.skill_level || undefined
      }
    };
  }
);
