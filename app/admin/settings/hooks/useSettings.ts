/**
 * useSettings Hook
 * Manages complete settings configuration
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  getSettings,
  updateCampaignSettings,
} from '@/repositories/admin/settings/settings';
import type { Settings } from '@/repositories/admin/settings/types';

interface UseSettingsReturn {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateCampaignMutation: (dto: {
    isActive?: boolean;
    campaignStartDate?: string | null;
    campaignEndDate?: string | null;
  }) => Promise<void>;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err: any) {
      const message = err.message || 'Error al cargar configuración';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateCampaignMutation = async (dto: {
    isActive?: boolean;
    campaignStartDate?: string | null;
    campaignEndDate?: string | null;
  }) => {
    try {
      await updateCampaignSettings(dto);
      toast.success('Campaña actualizada exitosamente');
      await fetchSettings();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar campaña');
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
    updateCampaignMutation,
  };
}
