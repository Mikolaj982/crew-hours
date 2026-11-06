import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveTimeEntry } from './api';

export const useSaveTimeEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveTimeEntry,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] }),
  });
};
