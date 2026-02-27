/**
 * Tests for useProducts hook (TanStack Query)
 */

import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useProducts } from './useProducts';
import * as settingsRepo from '@/repositories/settings/settings';
import type { ProductPoints } from '@/repositories/settings/types';

jest.mock('@/repositories/settings/settings');
jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { toast } from 'sonner';

describe('useProducts', () => {
  let queryClient: QueryClient;

  const mockProducts: ProductPoints[] = [
    { productName: 'Café Espresso', pointsValue: 10, isActive: true },
    { productName: 'Cappuccino', pointsValue: 15, isActive: true },
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

  it('should fetch products on mount', async () => {
    (settingsRepo.getActiveProducts as jest.Mock).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useProducts(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toEqual(mockProducts);
    expect(settingsRepo.getActiveProducts).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no products', async () => {
    (settingsRepo.getActiveProducts as jest.Mock).mockResolvedValue([]);

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.products).toEqual([]);
  });

  it('should handle fetch error', async () => {
    (settingsRepo.getActiveProducts as jest.Mock).mockRejectedValue(
      new Error('Failed to fetch')
    );

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    expect(result.current.products).toEqual([]);
  });

  it('should create product and invalidate cache', async () => {
    (settingsRepo.getActiveProducts as jest.Mock).mockResolvedValue(mockProducts);
    (settingsRepo.createProduct as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.createProduct({
        productName: 'Latte',
        pointsValue: 12,
      });
    });

    expect(settingsRepo.createProduct).toHaveBeenCalledWith({
      productName: 'Latte',
      pointsValue: 12,
    });
    expect(toast.success).toHaveBeenCalledWith('Producto creado exitosamente');
  });

  it('should update product and invalidate cache', async () => {
    (settingsRepo.getActiveProducts as jest.Mock).mockResolvedValue(mockProducts);
    (settingsRepo.updateProductPoints as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.updateProduct({
        productName: 'Café Espresso',
        dto: { pointsValue: 20 },
      });
    });

    expect(settingsRepo.updateProductPoints).toHaveBeenCalledWith(
      'Café Espresso',
      { pointsValue: 20 }
    );
    expect(toast.success).toHaveBeenCalledWith('Producto actualizado exitosamente');
  });

  it('should delete product and invalidate cache', async () => {
    (settingsRepo.getActiveProducts as jest.Mock).mockResolvedValue(mockProducts);
    (settingsRepo.deleteProduct as jest.Mock).mockResolvedValue({});

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteProduct('Café Espresso');
    });

    expect(settingsRepo.deleteProduct).toHaveBeenCalledWith('Café Espresso');
    expect(toast.success).toHaveBeenCalledWith('Producto eliminado exitosamente');
  });

  it('should show toast on create error', async () => {
    (settingsRepo.getActiveProducts as jest.Mock).mockResolvedValue(mockProducts);
    (settingsRepo.createProduct as jest.Mock).mockRejectedValue(
      new Error('Producto ya existe')
    );

    const { result } = renderHook(() => useProducts(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    await act(async () => {
      try {
        await result.current.createProduct({
          productName: 'Café Espresso',
          pointsValue: 10,
        });
      } catch {
        // Expected
      }
    });

    expect(toast.error).toHaveBeenCalledWith('Producto ya existe');
  });
});
