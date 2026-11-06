import { useQuery } from '@tanstack/react-query';
import { fetchMonthSummary } from './api';

export const useMonthSummary = (month: string) => {
  return useQuery({
    queryKey: ['timeEntries', 'summary', month],
    queryFn: () => fetchMonthSummary(month),
  });
};
