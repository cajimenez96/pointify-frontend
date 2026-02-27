import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { redeemPoints } from '@/repositories/transactions/transactions';
import type { RedeemPointsDto } from '@/repositories/transactions/types';

export function useRedeemPoints() {
  return useMutation({
    mutationFn: (dto: RedeemPointsDto) => redeemPoints(dto),
    onSuccess: (data) => {
      toast.success(data.message, {
        description: `Nuevo saldo: ${data.client.currentPoints} puntos`,
        icon: '🎉',
        duration: 7000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al canjear premio');
    },
  });
}
