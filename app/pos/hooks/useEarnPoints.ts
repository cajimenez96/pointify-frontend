/**
 * useEarnPoints Hook
 * Manages EARN operations (add points to client)
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { earnPoints } from '@/repositories/admin/transactions/transactions';
import type {
  EarnPointsDto,
  EarnResponse,
} from '@/repositories/admin/transactions/types';

interface UseEarnPointsReturn {
  isEarning: boolean;
  error: string | null;
  earnMutation: (dto: EarnPointsDto) => Promise<EarnResponse>;
  reset: () => void;
}

export function useEarnPoints(): UseEarnPointsReturn {
  const [isEarning, setIsEarning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const earnMutation = async (dto: EarnPointsDto): Promise<EarnResponse> => {
    setIsEarning(true);
    setError(null);

    try {
      const response = await earnPoints(dto);
      toast.success(response.message, {
        description: `Cliente: ${response.client.name}`,
        duration: 5000,
      });
      return response;
    } catch (err: any) {
      const message = err.message || 'Error al registrar venta';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsEarning(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return {
    isEarning,
    error,
    earnMutation,
    reset,
  };
}
