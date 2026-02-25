/**
 * Custom hook for fetching Admin Dashboard data
 * Combines stats, settings, and clients using TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/repositories/dashboard/dashboard";
import { getSettings } from "@/repositories/settings/settings";
import { getClients } from "@/repositories/clients/clients";
import type { DashboardStats } from "@/repositories/dashboard/types";
import type { Client, ClientCompany } from "@/repositories/clients/types";
import type { Settings } from "@/repositories/settings/types";
import { adaptClientCompanyToClient } from "@/repositories/clients/adapters/adaptClientCompanyToClient";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: getDashboardStats,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardSettings() {
  return useQuery<Settings>({
    queryKey: ["admin", "settings"],
    queryFn: getSettings,
    refetchOnWindowFocus: true,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardClients() {
  return useQuery<ClientCompany[], Error, Client[]>({
    queryKey: ["admin", "clients"],
    queryFn: getClients,
    select: adaptClientCompanyToClient,
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
  const activeClients = clients.filter((c) => c.status === "ACTIVE").length;
  const shadowClients = clients.filter((c) => c.status === "PENDING").length;
  const conversionRate =
    clients.length > 0 ? (activeClients / clients.length) * 100 : 0;

  return {
    stats: statsQuery.data ?? null,
    settings: settingsQuery.data ?? null,
    clients,
    activeClients,
    shadowClients,
    conversionRate,
    isLoading:
      statsQuery.isLoading || settingsQuery.isLoading || clientsQuery.isLoading,
    error: statsQuery.error || settingsQuery.error || clientsQuery.error,
  };
}
