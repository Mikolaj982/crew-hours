import { useQuery } from '@tanstack/react-query';
import { fetchSites } from '../sites/api';

export const useSites = () => {
  return useQuery({
    queryKey: ['sites'],
    queryFn: fetchSites,
  });
};
