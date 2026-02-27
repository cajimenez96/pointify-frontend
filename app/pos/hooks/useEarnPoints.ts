import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { earnPoints } from '@/repositories/transactions/transactions';
import type { EarnPointsDto } from '@/repositories/transactions/types';

export function useEarnPoints() {
  return useMutation({
    mutationFn: (dto: EarnPointsDto) => earnPoints(dto),
    onSuccess: (data) => {
      toast.success(data.message, {
        description: `Cliente: ${data.client.name}`,
        duration: 5000,
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al registrar venta');
    },
  });
}
