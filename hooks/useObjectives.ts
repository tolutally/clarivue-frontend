import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  objectivesService,
  type CreateObjectiveRequest,
  type UpdateObjectiveRequest,
  type ListObjectivesParams,
} from '@/services';

export const useObjectives = (params?: ListObjectivesParams) => {
  return useQuery({
    queryKey: ['objectives', params],
    queryFn: () => objectivesService.list(params),
  });
};

export const useObjective = (id: string | undefined) => {
  return useQuery({
    queryKey: ['objectives', id],
    queryFn: () => objectivesService.get(id!),
    enabled: !!id,
  });
};

export const useCreateObjective = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateObjectiveRequest) => objectivesService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
    },
  });
};

export const useUpdateObjective = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateObjectiveRequest }) =>
      objectivesService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
    },
  });
};

export const useDeleteObjective = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => objectivesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectives'] });
    },
  });
};

