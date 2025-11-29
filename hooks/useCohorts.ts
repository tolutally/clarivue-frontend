import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  cohortsService, 
  type CreateCohortRequest, 
  type UpdateCohortRequest,
  type BulkAddUsersRequest,
  type ListCohortsParams,
  type GetCohortMembersParams
} from '@/services';

export const useCohorts = (params?: ListCohortsParams) => {
  return useQuery({
    queryKey: ['cohorts', params],
    queryFn: () => cohortsService.list(params),
  });
};

export const useCohort = (id: string | undefined) => {
  return useQuery({
    queryKey: ['cohorts', id],
    queryFn: () => cohortsService.get(id!),
    enabled: !!id,
  });
};

export const useCreateCohort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateCohortRequest) => cohortsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });
};

export const useUpdateCohort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCohortRequest }) => 
      cohortsService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });
};

export const useDeleteCohort = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => cohortsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });
};

export const useBulkAddUsers = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cohortId, data }: { cohortId: string; data: BulkAddUsersRequest }) => 
      cohortsService.bulkAddUsers(cohortId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.cohortId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.cohortId] });
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });
};

export const useCohortMembers = (cohortId: string | undefined, params?: GetCohortMembersParams) => {
  return useQuery({
    queryKey: ['cohorts', cohortId, 'members', params],
    queryFn: () => cohortsService.getMembers(cohortId!, params),
    enabled: !!cohortId,
  });
};

export const useRemoveMember = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cohortId, userId }: { cohortId: string; userId: string }) => 
      cohortsService.removeMember(cohortId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.cohortId, 'members'] });
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.cohortId] });
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });
};

