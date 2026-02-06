/**
 * useClientPublic Hook
 * Fetches client data with rewards for public QR view
 * NO AUTHENTICATION REQUIRED
 */

import { useState, useCallback } from 'react';
import { getClientPublic } from '@/repositories/clients/clients';
import type { ClientPublicResponse } from '@/repositories/clients/types';

interface UseClientPublicReturn {
  clientData: ClientPublicResponse | null;
  isLoading: boolean;
  error: string | null;
  fetchClient: (dni: string, companyCode: string) => Promise<void>;
}

export function useClientPublic(): UseClientPublicReturn {
  const [clientData, setClientData] = useState<ClientPublicResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async (dni: string, companyCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getClientPublic(dni, companyCode);
      setClientData(data);
    } catch (err: any) {
      const message = err.message || 'Error al consultar cliente';
      setError(message);
      setClientData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    clientData,
    isLoading,
    error,
    fetchClient,
  };
}
