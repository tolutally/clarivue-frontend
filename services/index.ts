// Central export point for all services
export { authService } from './auth/auth.service';
export { cohortsService } from './cohorts/cohorts.service';
export { interviewsService } from './interviews/interviews.service';
export { mockInterviewsService } from './mockinterviews/mockinterviews.service';
export { analysisService } from './analysis/analysis.service';

// Export types
export type {
  AdminInfo,
  Subscription,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  GoogleOAuthRequest,
  GoogleOAuthResponse,
  SendPasswordResetOtpRequest,
  SendPasswordResetOtpResponse,
  VerifyPasswordResetOtpRequest,
  VerifyPasswordResetOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SendVerificationOtpRequest,
  SendVerificationOtpResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  VerifyInviteRequest,
  VerifyInviteResponse,
  CompleteOnboardingRequest,
  CompleteOnboardingResponse,
} from './auth/auth.service';

export type {
  Cohort,
  CreateCohortRequest,
  AddStudentsRequest,
  SendInvitesRequest,
} from './cohorts/cohorts.service';

export type {
  ValidateInviteResponse,
  SubmitProfileRequest,
  SubmitConsentRequest,
  SetupSessionRequest,
  SubmitPreflightRequest,
  RTCTokenResponse,
  InterviewReport,
} from './interviews/interviews.service';

export type {
  VerifyTokenRequest,
  VerifyTokenResponse,
  SubmitConsentRequest as MockSubmitConsentRequest,
  ParseJDRequest,
  ParseJDResponse,
  GetJDMetricsRequest,
  GetJDMetricsResponse,
  UpdateJDMetricsRequest,
  CompleteProfileRequest,
  CreateInterviewSessionRequest,
  CreateInterviewSessionResponse,
} from './mockinterviews/mockinterviews.service';

