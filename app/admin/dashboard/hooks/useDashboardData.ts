/**
 * Custom hook for fetching Admin Dashboard data
 * Combines stats, settings, and clients using TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { getDashboardStats, getClients } from '@/repositories/admin/dashboard/dashboard';
import { getSettings } from '@/repositories/admin/settings/settings';
import type { DashboardStats, ClientSummary } from '@/repositories/admin/dashboard/types';
import type { Settings } from '@/repositories/admin/settings/types';

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: getDashboardStats,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardSettings() {
  return useQuery<Settings>({
    queryKey: ['admin', 'settings'],
    queryFn: getSettings,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardClients() {
  return useQuery<ClientSummary[]>({
    queryKey: ['admin', 'clients'],
    queryFn: getClients,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Combined hook that provides all dashboard data with computed values
 */
export function useDashboardData() {
  const statsQuery = useDashboardStats();
  const settingsQuery = useDashboardSettings();
  const clientsQuery = useDashboardClients();

  const clients = clientsQuery.data ?? [];
  const activeClients = clients.filter((c) => c.status === 'ACTIVE').length;
  const shadowClients = clients.filter((c) => c.status === 'PENDING').length;
  const conversionRate =
    clients.length > 0 ? (activeClients / clients.length) * 100 : 0;

  return {
    stats: statsQuery.data ?? null,
    settings: settingsQuery.data ?? null,
    clients,
    activeClients,
    shadowClients,
    conversionRate,
    isLoading: statsQuery.isLoading || settingsQuery.isLoading || clientsQuery.isLoading,
    error: statsQuery.error || settingsQuery.error || clientsQuery.error,
  };
}
