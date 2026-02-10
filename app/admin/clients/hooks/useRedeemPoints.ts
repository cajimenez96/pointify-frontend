/**
 * useRedeemPoints Hook
 * Manages point redemption mutations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { redeemPoints } from '@/repositories/transactions/transactions';
import { RedeemPointsDto } from '@/repositories/transactions/types';

export function useRedeemPoints() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dto: RedeemPointsDto) => redeemPoints(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'clients'] });
      toast.success('Puntos canjeados exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al canjear puntos');
    },
  });

  return {
    redeemPoints: mutation.mutateAsync,
    isRedeeming: mutation.isPending,
  };
}
