import { api } from "encore.dev/api";
import { db } from "../db";
import { Header } from "encore.dev/api";

export interface ConsentChoices {
  recordingConsent: boolean;
  dataUsageConsent: boolean;
  researchConsent: boolean;
}

export interface SubmitConsentRequest {
  token: string;
  consents: ConsentChoices;
}

export interface SubmitConsentResponse {
  success: boolean;
  consentId?: number;
  message?: string;
}

export const submitConsent = api(
  { expose: true, method: "POST", path: "/mockinterviews/submit-consent" },
  async (
    req: SubmitConsentRequest,
    xForwardedFor?: Header<"x-forwarded-for">,
    userAgent?: Header<"user-agent">
  ): Promise<SubmitConsentResponse> => {
    if (!req.consents.recordingConsent || !req.consents.dataUsageConsent) {
      return {
        success: false,
        message: "Recording and data usage consent are required to proceed"
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
    const ipAddress = xForwardedFor?.split(',')[0].trim() || 'unknown';

    const result = await db.queryRow<{ id: bigint }>`
      INSERT INTO student_consents 
      (student_id, recording_consent, data_usage_consent, research_consent, ip_address, user_agent)
      VALUES (${studentId}, ${req.consents.recordingConsent}, ${req.consents.dataUsageConsent}, 
              ${req.consents.researchConsent}, ${ipAddress}, ${userAgent || 'unknown'})
      RETURNING id
    `;

    await db.exec`
      UPDATE onboarding_tokens 
      SET current_step = 'jd-intake' 
      WHERE token = ${req.token}
    `;

    return {
      success: true,
      consentId: Number(result!.id)
    };
  }
);
