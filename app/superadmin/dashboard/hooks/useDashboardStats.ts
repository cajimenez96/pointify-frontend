/**
 * Custom hook for fetching SuperAdmin Dashboard statistics
 * Uses TanStack Query for caching and auto-refresh
 */

import { useQuery } from '@tanstack/react-query';
import { getStats } from '@/repositories/superadmin/dashboard/dashboard';
import type { DashboardStats } from '@/repositories/superadmin/dashboard/types';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['superadmin', 'dashboard', 'stats'],
    queryFn: getStats,
    // Refetch every 60 seconds to keep stats fresh
    // refetchInterval: 60000,
    // Refetch on window focus
    refetchOnWindowFocus: true,
    // Keep data in cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });
}
