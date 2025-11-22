import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, type LoginRequest, type RegisterRequest, type GoogleOAuthRequest, type SendPasswordResetOtpRequest, type VerifyPasswordResetOtpRequest, type ResetPasswordRequest, type SendVerificationOtpRequest, type VerifyEmailRequest, type VerifyInviteRequest, type CompleteOnboardingRequest } from '@/services';
import { useNavigate } from 'react-router-dom';

export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      localStorage.setItem('auth_token', response.access_token);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      // Navigate immediately - PublicRoute will redirect if needed
      navigate('/overview', { replace: true });
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response, variables) => {
      // Don't auto-login after registration
      // Navigate to email verification page
      navigate('/verify-email', { 
        state: { email: variables.email },
        replace: true 
      });
    },
  });
};

export const useGoogleOAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: GoogleOAuthRequest) => authService.googleOAuth(data),
    onSuccess: (response) => {
      localStorage.setItem('auth_token', response.access_token);
      queryClient.setQueryData(['auth', 'me'], response.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      navigate('/overview');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('auth_token');
      queryClient.clear();
      navigate('/login');
    },
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.getMe(),
    enabled: !!localStorage.getItem('auth_token'),
    retry: false,
  });
};

export const useSendPasswordResetOtp = () => {
  return useMutation({
    mutationFn: (data: SendPasswordResetOtpRequest) => authService.sendPasswordResetOtp(data),
  });
};

export const useVerifyPasswordResetOtp = () => {
  return useMutation({
    mutationFn: (data: VerifyPasswordResetOtpRequest) => authService.verifyPasswordResetOtp(data),
  });
};

export const useResetPassword = () => {
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => authService.resetPassword(data),
    onSuccess: () => {
      navigate('/login');
    },
  });
};

export const useSendVerificationOtp = () => {
  return useMutation({
    mutationFn: (data: SendVerificationOtpRequest) => authService.sendVerificationOtp(data),
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (data: VerifyEmailRequest) => authService.verifyEmail(data),
  });
};

export const useVerifyInvite = () => {
  return useMutation({
    mutationFn: (data: VerifyInviteRequest) => authService.verifyInvite(data),
  });
};

export const useCompleteOnboarding = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  return useMutation({
    mutationFn: (data: CompleteOnboardingRequest) => authService.completeOnboarding(data),
    onSuccess: (response) => {
      localStorage.setItem('auth_token', response.access_token);
      queryClient.setQueryData(['auth', 'me'], response.user);
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      navigate('/overview');
    },
  });
};

