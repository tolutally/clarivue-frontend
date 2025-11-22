// Central export point for all services
export { authService } from './auth/auth.service';
export { cohortsService } from './cohorts/cohorts.service';
export { interviewsService } from './interviews/interviews.service';
export { mockInterviewsService } from './mockinterviews/mockinterviews.service';
export { analysisService } from './analysis/analysis.service';
export { sessionInvitesService } from './sessionInvites/sessionInvites.service';

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
  Term,
  Program,
  CustomTag,
  Objective,
  PaginatedCohortsResponse,
  ListCohortsParams,
  CreateCohortRequest,
  UpdateCohortRequest,
  BulkAddUsersRequest,
  CohortMember,
  PaginatedMembersResponse,
  GetCohortMembersParams,
} from './cohorts/cohorts.service';

export {
  termsService,
  type Term as TermType,
  type PaginatedTermsResponse,
  type ListTermsParams,
  type CreateTermRequest,
  type UpdateTermRequest,
} from './terms/terms.service';

export {
  programsService,
  type Program as ProgramType,
  type PaginatedProgramsResponse,
  type ListProgramsParams,
  type CreateProgramRequest,
  type UpdateProgramRequest,
} from './programs/programs.service';

export {
  objectivesService,
  type Objective as ObjectiveType,
  type PaginatedObjectivesResponse,
  type ListObjectivesParams,
  type CreateObjectiveRequest,
  type UpdateObjectiveRequest,
} from './objectives/objectives.service';

export {
  customTagsService,
  type CustomTag as CustomTagType,
  type PaginatedCustomTagsResponse,
  type ListCustomTagsParams,
  type CreateCustomTagRequest,
  type UpdateCustomTagRequest,
} from './customTags/customTags.service';

export type {
  SessionInvite,
  PaginatedInvitesResponse,
  ListInvitesParams,
  CreateBatchInviteRequest,
  ExtendUserSessionsRequest,
  VerifySessionTokenRequest,
} from './sessionInvites/sessionInvites.service';

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

