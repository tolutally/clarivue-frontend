import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  programsService,
  type CreateProgramRequest,
  type UpdateProgramRequest,
  type ListProgramsParams,
} from '@/services';

export const usePrograms = (params?: ListProgramsParams) => {
  return useQuery({
    queryKey: ['programs', params],
    queryFn: () => programsService.list(params),
  });
};

export const useProgram = (id: string | undefined) => {
  return useQuery({
    queryKey: ['programs', id],
    queryFn: () => programsService.get(id!),
    enabled: !!id,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProgramRequest) => programsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProgramRequest }) =>
      programsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => programsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programs'] });
    },
  });
};

