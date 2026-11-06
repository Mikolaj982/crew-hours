import { useQuery } from '@tanstack/react-query';
import { fetchTimeEntries } from './api';

export const useTimeEntries = (month: string, siteId: string) => {
  return useQuery({
    queryKey: ['timeEntries', siteId, month],
    queryFn: () => fetchTimeEntries(month, siteId),
  });
};
