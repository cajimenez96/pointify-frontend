/**
 * useRedeemPoints Hook
 * Manages REDEEM operations (spend points for rewards)
 */

import { useState } from 'react';
import { toast } from 'sonner';
import { redeemPoints } from '@/repositories/admin/transactions/transactions';
import type {
  RedeemPointsDto,
  RedeemResponse,
} from '@/repositories/admin/transactions/types';

interface UseRedeemPointsReturn {
  isRedeeming: boolean;
  error: string | null;
  redeemMutation: (dto: RedeemPointsDto) => Promise<RedeemResponse>;
  reset: () => void;
}

export function useRedeemPoints(): UseRedeemPointsReturn {
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redeemMutation = async (dto: RedeemPointsDto): Promise<RedeemResponse> => {
    setIsRedeeming(true);
    setError(null);

    try {
      const response = await redeemPoints(dto);
      
      // Success with confetti icon
      toast.success(response.message, {
        description: `Nuevo saldo: ${response.client.currentPoints} puntos`,
        icon: '🎉',
        duration: 7000,
      });
      
      return response;
    } catch (err: any) {
      const message = err.message || 'Error al canjear premio';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setIsRedeeming(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return {
    isRedeeming,
    error,
    redeemMutation,
    reset,
  };
}
