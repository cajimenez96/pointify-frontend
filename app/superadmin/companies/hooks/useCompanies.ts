/**
 * Hook for fetching and managing companies list with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '@/repositories/superadmin/companies/companies';
import type { QueryCompaniesDto } from '@/repositories/superadmin/companies/types';

export function useCompaniesQuery(filters?: QueryCompaniesDto) {
  return useQuery({
    queryKey: ['companies', filters],
    queryFn: () => getCompanies(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });
}
