import { useMutation, useQuery } from '@tanstack/react-query';
import { interviewsService, type SubmitProfileRequest, type SubmitConsentRequest, type SetupSessionRequest, type SubmitPreflightRequest } from '@/services';

export const useValidateInvite = () => {
  return useMutation({
    mutationFn: (token: string) => interviewsService.validateInvite(token),
  });
};

export const useSubmitProfile = () => {
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: SubmitProfileRequest }) => 
      interviewsService.submitProfile(sessionId, data),
  });
};

export const useSubmitConsent = () => {
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: SubmitConsentRequest }) => 
      interviewsService.submitConsent(sessionId, data),
  });
};

export const useSetupSession = () => {
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: SetupSessionRequest }) => 
      interviewsService.setupSession(sessionId, data),
  });
};

export const useSubmitPreflight = () => {
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: SubmitPreflightRequest }) => 
      interviewsService.submitPreflight(sessionId, data),
  });
};

export const useGetRTCToken = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ['interviews', 'rtc-token', sessionId],
    queryFn: () => interviewsService.getRTCToken(sessionId!),
    enabled: !!sessionId,
  });
};

export const useCompleteInterview = () => {
  return useMutation({
    mutationFn: (sessionId: string) => interviewsService.completeInterview(sessionId),
  });
};

export const useInterviewReport = (sessionId: string | undefined) => {
  return useQuery({
    queryKey: ['interviews', 'report', sessionId],
    queryFn: () => interviewsService.getReport(sessionId!),
    enabled: !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'processing') {
        return 5000; // Poll every 5 seconds while processing
      }
      return false;
    },
  });
};

