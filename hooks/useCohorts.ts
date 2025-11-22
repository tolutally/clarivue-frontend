import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { cohortsService, type CreateCohortRequest, type AddStudentsRequest, type SendInvitesRequest } from '@/services';

export const useCohorts = () => {
  return useQuery({
    queryKey: ['cohorts'],
    queryFn: () => cohortsService.list(),
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

export const useAddStudents = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cohortId, data }: { cohortId: string; data: AddStudentsRequest }) => 
      cohortsService.addStudents(cohortId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.cohortId] });
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });
};

export const useSendInvites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ cohortId, data }: { cohortId: string; data: SendInvitesRequest }) => 
      cohortsService.sendInvites(cohortId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cohorts', variables.cohortId] });
      queryClient.invalidateQueries({ queryKey: ['cohorts'] });
    },
  });
};

