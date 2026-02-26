/**
 * useClients Hook
 * Manages clients data fetching with TanStack Query
 */

import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/repositories/clients/clients";
import type { Client, ClientCompany } from "@/repositories/clients/types";
import { adaptClientCompanyToClient } from "@/repositories/clients/adapters/adaptClientCompanyToClient";

export function useClients() {
  const clientsQuery = useQuery<ClientCompany[]>({
    queryKey: ["admin", "clients"],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const adaptedClients: Client[] = clientsQuery.data
    ? adaptClientCompanyToClient(clientsQuery.data)
    : [];

  return {
    clients: adaptedClients ?? [],
    isLoading: clientsQuery.isLoading,
    error: clientsQuery.error,
    refetch: clientsQuery.refetch,
    isRefetching: clientsQuery.isRefetching,
  };
}
