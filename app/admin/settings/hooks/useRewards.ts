/**
 * useRewards Hook
 * Manages rewards catalog with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAllRewards,
  getActiveRewards,
  createReward,
  updateReward,
  deleteReward,
} from '@/repositories/settings/settings';
import type {
  Reward,
  CreateRewardDto,
  UpdateRewardDto,
} from '@/repositories/settings/types';

export function useRewards(activeOnly: boolean = false) {
  const queryClient = useQueryClient();

  const rewardsQuery = useQuery<Reward[]>({
    queryKey: ['admin', 'rewards', { activeOnly }],
    queryFn: () => (activeOnly ? getActiveRewards() : getAllRewards()),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateRewardDto) => createReward(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      toast.success('Premio creado exitosamente');
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Error al crear premio'),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      rewardId,
      dto,
    }: {
      rewardId: string;
      dto: UpdateRewardDto;
    }) => updateReward(rewardId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      toast.success('Premio actualizado exitosamente');
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Error al actualizar premio'),
  });

  const deleteMutation = useMutation({
    mutationFn: (rewardId: string) => deleteReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'rewards'] });
      toast.success('Premio desactivado exitosamente');
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Error al desactivar premio'),
  });

  return {
    rewards: rewardsQuery.data ?? [],
    isLoading: rewardsQuery.isLoading,
    error: rewardsQuery.error,
    createReward: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateReward: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteReward: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
