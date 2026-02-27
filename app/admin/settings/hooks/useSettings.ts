/**
 * useSettings Hook
 * Manages campaign settings with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getSettings,
  updateCampaignSettings,
} from '@/repositories/settings/settings';
import type { Settings } from '@/repositories/settings/types';

export function useSettings() {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery<Settings>({
    queryKey: ['admin', 'settings'],
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const updateCampaignMutation = useMutation({
    mutationFn: (dto: {
      isActive?: boolean;
      campaignStartDate?: string | null;
      campaignEndDate?: string | null;
    }) => updateCampaignSettings(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      toast.success('Campaña actualizada exitosamente');
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Error al actualizar campaña'),
  });

  return {
    settings: settingsQuery.data ?? null,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    updateCampaign: updateCampaignMutation.mutateAsync,
    isUpdating: updateCampaignMutation.isPending,
  };
}
