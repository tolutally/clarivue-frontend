import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  sessionInvitesService,
  type CreateBatchInviteRequest,
  type ExtendUserSessionsRequest,
  type VerifySessionTokenRequest,
  type ListInvitesParams,
} from '@/services';

export const useSessionInvites = (params?: ListInvitesParams) => {
  return useQuery({
    queryKey: ['sessionInvites', params],
    queryFn: () => sessionInvitesService.list(params),
  });
};

export const useSessionInvite = (inviteId: string | undefined) => {
  return useQuery({
    queryKey: ['sessionInvites', inviteId],
    queryFn: () => sessionInvitesService.get(inviteId!),
    enabled: !!inviteId,
  });
};

export const useCreateBatchInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBatchInviteRequest) => sessionInvitesService.createBatch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionInvites'] });
    },
  });
};

export const useDeleteSessionInvite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inviteId: string) => sessionInvitesService.delete(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessionInvites'] });
    },
  });
};

export const useSessionInviteStats = (inviteId: string | undefined) => {
  return useQuery({
    queryKey: ['sessionInvites', inviteId, 'stats'],
    queryFn: () => sessionInvitesService.getStats(inviteId!),
    enabled: !!inviteId,
  });
};

export const useExtendUserSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inviteId,
      userId,
      data,
    }: {
      inviteId: string;
      userId: string;
      data: ExtendUserSessionsRequest;
    }) => sessionInvitesService.extendUserSessions(inviteId, userId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sessionInvites', variables.inviteId] });
      queryClient.invalidateQueries({ queryKey: ['sessionInvites'] });
    },
  });
};

export const useSessionStatus = (params?: { token?: string; [key: string]: any }) => {
  return useQuery({
    queryKey: ['sessionInvites', 'session-status', params],
    queryFn: () => sessionInvitesService.getSessionStatus(params),
    enabled: !!params?.token,
  });
};

export const useVerifySessionToken = () => {
  return useMutation({
    mutationFn: (data: VerifySessionTokenRequest) => sessionInvitesService.verifyToken(data),
  });
};

