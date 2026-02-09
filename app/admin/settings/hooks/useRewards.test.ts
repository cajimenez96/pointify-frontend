/**
 * Tests for useRewards hook (TanStack Query)
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRewards } from './useRewards';
import * as settingsRepo from '@/repositories/admin/settings/settings';
import type { Reward } from '@/repositories/admin/settings/types';

jest.mock('@/repositories/admin/settings/settings');
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { toast } from 'sonner';

describe('useRewards', () => {
  let queryClient: QueryClient;

  const mockRewards: Reward[] = [
    {
      _id: 'r1',
      name: 'Café Gratis',
      pointsCost: 100,
      stock: null,
      isActive: true,
    },
    {
      _id: 'r2',
      name: 'Taza',
      description: 'Taza personalizada',
      pointsCost: 200,
      stock: 50,
      isActive: true,
    },
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it('should fetch all rewards on mount', async () => {
    (settingsRepo.getAllRewards as jest.Mock).mockResolvedValue(mockRewards);

    const { result } = renderHook(() => useRewards(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.rewards).toEqual(mockRewards);
    expect(settingsRepo.getAllRewards).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    (settingsRepo.getAllRewards as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    const { result } = renderHook(() => useRewards(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.rewards).toEqual([]);
  });

  it('should create reward and show toast', async () => {
    (settingsRepo.getAllRewards as jest.Mock).mockResolvedValue(mockRewards);
    (settingsRepo.createReward as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRewards(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.createReward({
        name: 'Nuevo Premio',
        pointsCost: 50,
      });
    });

    expect(settingsRepo.createReward).toHaveBeenCalledWith({
      name: 'Nuevo Premio',
      pointsCost: 50,
    });
    expect(toast.success).toHaveBeenCalledWith('Premio creado exitosamente');
  });

  it('should update reward and show toast', async () => {
    (settingsRepo.getAllRewards as jest.Mock).mockResolvedValue(mockRewards);
    (settingsRepo.updateReward as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRewards(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateReward({
        rewardId: 'r1',
        dto: { pointsCost: 150 },
      });
    });

    expect(settingsRepo.updateReward).toHaveBeenCalledWith('r1', {
      pointsCost: 150,
    });
    expect(toast.success).toHaveBeenCalledWith('Premio actualizado exitosamente');
  });

  it('should delete (soft) reward and show toast', async () => {
    (settingsRepo.getAllRewards as jest.Mock).mockResolvedValue(mockRewards);
    (settingsRepo.deleteReward as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useRewards(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteReward('r1');
    });

    expect(settingsRepo.deleteReward).toHaveBeenCalledWith('r1');
    expect(toast.success).toHaveBeenCalledWith('Premio desactivado exitosamente');
  });

  it('should show toast on create error', async () => {
    (settingsRepo.getAllRewards as jest.Mock).mockResolvedValue(mockRewards);
    (settingsRepo.createReward as jest.Mock).mockRejectedValue(
      new Error('Nombre duplicado')
    );

    const { result } = renderHook(() => useRewards(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.createReward({
          name: 'Café Gratis',
          pointsCost: 100,
        });
      } catch {
        // Expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith('Nombre duplicado');
  });
});
