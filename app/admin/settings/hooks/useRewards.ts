/**
 * useRewards Hook
 * Manages rewards catalog (prizes)
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  getAllRewards,
  getActiveRewards,
  createReward,
  updateReward,
  deleteReward,
} from '@/repositories/admin/settings/settings';
import type {
  Reward,
  CreateRewardDto,
  UpdateRewardDto,
} from '@/repositories/admin/settings/types';

interface UseRewardsReturn {
  rewards: Reward[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRewardMutation: (dto: CreateRewardDto) => Promise<void>;
  updateRewardMutation: (rewardId: string, dto: UpdateRewardDto) => Promise<void>;
  deleteRewardMutation: (rewardId: string) => Promise<void>;
}

export function useRewards(activeOnly: boolean = false): UseRewardsReturn {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRewards = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = activeOnly ? await getActiveRewards() : await getAllRewards();
      setRewards(data);
    } catch (err: any) {
      const message = err.message || 'Error al cargar premios';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [activeOnly]);

  const createRewardMutation = async (dto: CreateRewardDto) => {
    try {
      await createReward(dto);
      toast.success('Premio creado exitosamente');
      await fetchRewards(); // Refresh list
    } catch (err: any) {
      toast.error(err.message || 'Error al crear premio');
      throw err;
    }
  };

  const updateRewardMutation = async (rewardId: string, dto: UpdateRewardDto) => {
    try {
      await updateReward(rewardId, dto);
      toast.success('Premio actualizado exitosamente');
      await fetchRewards();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar premio');
      throw err;
    }
  };

  const deleteRewardMutation = async (rewardId: string) => {
    try {
      await deleteReward(rewardId);
      toast.success('Premio desactivado exitosamente');
      await fetchRewards();
    } catch (err: any) {
      toast.error(err.message || 'Error al desactivar premio');
      throw err;
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  return {
    rewards,
    isLoading,
    error,
    refetch: fetchRewards,
    createRewardMutation,
    updateRewardMutation,
    deleteRewardMutation,
  };
}
