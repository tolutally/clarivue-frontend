import apiClient from '../api/client';

// User/Admin Info Type (based on API response)
export interface AdminInfo {
  _id: string;
  name: string;
  email: string;
  email_verified: boolean;
  terms_accepted: boolean;
  role: {
    _id: string;
    name: string;
    description: string;
    user_type: string;
    permissions: string[];
  };
  created_at: string;
  updated_at: string;
  companies?: {
    staff_companies: Array<{
      _id: string;
      name: string;
      role: string;
    }>;
    cohort_companies: Array<{
      _id: string;
      name: string;
    }>;
  };
  company?: string | null;
  provider?: string | null;
}

// Subscription type
export interface Subscription {
  plan_name: string;
  plan_type: string;
  minutes_included: number;
  minutes_used: number;
  minutes_remaining: number;
  period_start: string;
  period_end: string;
  status: string;
  is_expired: boolean;
}

// GetMe response type
export interface GetMeResponse {
  user: AdminInfo;
  subscription: Subscription;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: AdminInfo;
  subscription?: {
    plan_name: string;
    plan_type: string;
    minutes_included: number;
    minutes_used: number;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  company_name: string;
  password: string;
}

export interface RegisterResponse {
  token: string;
  admin: AdminInfo;
}

export interface GoogleOAuthRequest {
  token: string;
}

export interface GoogleOAuthResponse {
  access_token: string;
  token_type: string;
  user: AdminInfo;
  subscription?: {
    plan_name: string;
    plan_type: string;
    minutes_included: number;
    minutes_used: number;
  };
}

export interface SendPasswordResetOtpRequest {
  email: string;
}

export interface SendPasswordResetOtpResponse {
  success: boolean;
  message?: string;
}

export interface VerifyPasswordResetOtpRequest {
  email: string;
  otp_code: string;
}

export interface VerifyPasswordResetOtpResponse {
  token: string;
  message?: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp_code: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
}

export interface SendVerificationOtpRequest {
  email: string;
}

export interface SendVerificationOtpResponse {
  success: boolean;
  message?: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp_code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
}

export interface VerifyInviteRequest {
  token: string;
}

export interface VerifyInviteResponse {
  valid: boolean;
  email: string;
  firstName: string;
  lastName: string;
  message?: string;
}

export interface CompleteOnboardingRequest {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CompleteOnboardingResponse {
  access_token: string;
  token_type: string;
  user: AdminInfo;
  subscription?: {
    plan_name: string;
    plan_type: string;
    minutes_included: number;
    minutes_used: number;
  };
}

// API Response Wrapper
interface ApiResponseWrapper<T> {
  status_code: number;
  message: string;
  data: T;
  error: null | any;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<ApiResponseWrapper<LoginResponse>>('/auth/login', data);
    return response.data.data;
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<ApiResponseWrapper<RegisterResponse>>('/auth/register', data);
    return response.data.data;
  }

  async googleOAuth(data: GoogleOAuthRequest): Promise<GoogleOAuthResponse> {
    const response = await apiClient.post<ApiResponseWrapper<GoogleOAuthResponse>>('/auth/google-oauth', data);
    return response.data.data;
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }

  async getMe(): Promise<GetMeResponse> {
    const response = await apiClient.get<ApiResponseWrapper<GetMeResponse>>('/auth/me');
    return response.data.data;
  }

  async sendPasswordResetOtp(data: SendPasswordResetOtpRequest): Promise<SendPasswordResetOtpResponse> {
    const response = await apiClient.post<ApiResponseWrapper<SendPasswordResetOtpResponse>>('/auth/send-password-reset-otp', data);
    return response.data.data;
  }

  async verifyPasswordResetOtp(data: VerifyPasswordResetOtpRequest): Promise<VerifyPasswordResetOtpResponse> {
    const response = await apiClient.post<ApiResponseWrapper<VerifyPasswordResetOtpResponse>>('/auth/verify-password-reset-otp', data);
    return response.data.data;
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    const response = await apiClient.post<ApiResponseWrapper<ResetPasswordResponse>>('/auth/reset-password', data);
    return response.data.data;
  }

  async sendVerificationOtp(data: SendVerificationOtpRequest): Promise<SendVerificationOtpResponse> {
    const response = await apiClient.post<ApiResponseWrapper<SendVerificationOtpResponse>>('/auth/send-verification-otp', data);
    return response.data.data;
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<ApiResponseWrapper<VerifyEmailResponse>>('/auth/verify-email', data);
    return response.data.data;
  }

  async verifyInvite(data: VerifyInviteRequest): Promise<VerifyInviteResponse> {
    const response = await apiClient.post<ApiResponseWrapper<VerifyInviteResponse>>('/auth/onboard/verify', data);
    return response.data.data;
  }

  async completeOnboarding(data: CompleteOnboardingRequest): Promise<CompleteOnboardingResponse> {
    const response = await apiClient.post<ApiResponseWrapper<CompleteOnboardingResponse>>('/auth/onboard/complete', data);
    return response.data.data;
  }
}

export const authService = new AuthService();

