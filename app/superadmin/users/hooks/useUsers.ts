/**
 * Hook for fetching and managing users list with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/repositories/superadmin/users/users';
import type { QueryUsersDto } from '@/repositories/superadmin/users/types';

export function useUsersQuery(filters?: QueryUsersDto) {
  // Only fetch when we have at least one filter (especially companyId)
  const hasFilters = filters && Object.keys(filters).length > 0;

  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => getUsers(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
    enabled: hasFilters, // Only run query when filters are provided
  });
}
