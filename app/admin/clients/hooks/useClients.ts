/**
 * useClients Hook
 * Manages clients data fetching with TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { getClients } from '@/repositories/clients/clients';
import type { Client } from '@/repositories/clients/types';

export function useClients() {
  const clientsQuery = useQuery<Client[]>({
    queryKey: ['admin', 'clients'],
    queryFn: getClients,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    clients: clientsQuery.data ?? [],
    isLoading: clientsQuery.isLoading,
    error: clientsQuery.error,
    refetch: clientsQuery.refetch,
    isRefetching: clientsQuery.isRefetching,
  };
}
