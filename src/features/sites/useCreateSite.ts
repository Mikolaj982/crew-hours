import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSite } from '../sites/api';

export const useCreateSite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sites'] }),
  });
};
