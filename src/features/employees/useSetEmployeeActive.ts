import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setEmployeeActive } from './api';

export const useSetEmployeeActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setEmployeeActive,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
};
