import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setSiteActive } from '../sites/api';

export const useSetSiteActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setSiteActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['sites'] }),
  });
};
