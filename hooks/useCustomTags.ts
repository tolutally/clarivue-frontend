import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  customTagsService,
  type CreateCustomTagRequest,
  type UpdateCustomTagRequest,
  type ListCustomTagsParams,
} from '@/services';

export const useCustomTags = (params?: ListCustomTagsParams) => {
  return useQuery({
    queryKey: ['customTags', params],
    queryFn: () => customTagsService.list(params),
  });
};

export const useCustomTag = (id: string | undefined) => {
  return useQuery({
    queryKey: ['customTags', id],
    queryFn: () => customTagsService.get(id!),
    enabled: !!id,
  });
};

export const useCreateCustomTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCustomTagRequest) => customTagsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customTags'] });
    },
  });
};

export const useUpdateCustomTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCustomTagRequest }) =>
      customTagsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customTags'] });
    },
  });
};

export const useDeleteCustomTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customTagsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customTags'] });
    },
  });
};

