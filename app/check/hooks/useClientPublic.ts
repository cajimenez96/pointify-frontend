/**
 * useClientPublic Hook
 * Fetches client data with rewards for public QR view
 * NO AUTHENTICATION REQUIRED — uses TanStack Query
 */

import { useQuery } from '@tanstack/react-query';
import { getClientPublic } from '@/repositories/clients/clients';
import type { ClientPublicResponse } from '@/repositories/clients/types';

export function useClientPublic(dni: string, companyCode: string | null) {
  return useQuery<ClientPublicResponse>({
    queryKey: ['check', 'client', dni, companyCode],
    queryFn: () => getClientPublic(dni, companyCode!),
    enabled: !!dni && !!companyCode,
    retry: 1,
  });
}
