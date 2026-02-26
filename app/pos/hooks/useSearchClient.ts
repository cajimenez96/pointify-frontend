import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth-store';
import { getClientPublic } from '@/repositories/clients/clients';
import type { ClientSearchResult } from '../types';

export function useSearchClient() {
  const companyCode = useAuthStore((s) => s.user?.companyCode);

  return useMutation({
    mutationFn: async (dni: string): Promise<ClientSearchResult> => {
      const data = await getClientPublic(dni, companyCode!);
      return {
        exists: data.exists,
        hasRelation: data.hasRelation,
        dni: data.dni,
        name: data.name || `Cliente ${data.dni}`,
        status: data.status,
        currentPoints: data.currentPoints,
        totalAccumulated: data.totalAccumulated,
      };
    },
  });
}
