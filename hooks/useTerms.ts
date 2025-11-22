import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  termsService,
  type CreateTermRequest,
  type UpdateTermRequest,
  type ListTermsParams,
} from '@/services';

export const useTerms = (params?: ListTermsParams) => {
  return useQuery({
    queryKey: ['terms', params],
    queryFn: () => termsService.list(params),
  });
};

export const useTerm = (id: string | undefined) => {
  return useQuery({
    queryKey: ['terms', id],
    queryFn: () => termsService.get(id!),
    enabled: !!id,
  });
};

export const useCreateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTermRequest) => termsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

export const useUpdateTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTermRequest }) =>
      termsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

export const useDeleteTerm = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => termsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['terms'] });
    },
  });
};

