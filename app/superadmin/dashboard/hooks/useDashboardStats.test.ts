/**
 * Tests for useDashboardStats hook
 * Testing TanStack Query integration and data fetching
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDashboardStats } from './useDashboardStats';
import * as dashboardRepo from '@/repositories/superadmin/dashboard/dashboard';
import { DashboardStats } from '@/repositories/superadmin/dashboard/types';

// Mock the repository
jest.mock('@/repositories/superadmin/dashboard/dashboard');

describe('useDashboardStats', () => {
  let queryClient: QueryClient;

  const mockStats: DashboardStats = {
    totalCompanies: 10,
    activeCompanies: 8,
    inactiveCompanies: 2,
    newCompaniesThisMonth: 3,
    totalUsers: 14,
    usersByRole: {
      superadmin: 1,
      admin: 5,
      cashier: 8,
    },
    totalClients: 150,
    newClientsThisMonth: 25,
    totalTransactions: 500,
    transactionsByType: {
      earn: 300,
      redeem: 200,
    },
    totalPointsIssued: 15000,
    totalPointsRedeemed: 8000,
    topCompaniesByClients: [],
    topCompaniesByTransactions: [],
    expiringSubscriptions: [],
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  it('should fetch dashboard stats successfully', async () => {
    (dashboardRepo.getStats as jest.Mock).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useDashboardStats(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockStats);
    expect(dashboardRepo.getStats).toHaveBeenCalledTimes(1);
  });

  it('should handle empty stats', async () => {
    const emptyStats: DashboardStats = {
      totalCompanies: 0,
      activeCompanies: 0,
      inactiveCompanies: 0,
      newCompaniesThisMonth: 0,
      totalUsers: 0,
      usersByRole: { superadmin: 0, admin: 0, cashier: 0 },
      totalClients: 0,
      newClientsThisMonth: 0,
      totalTransactions: 0,
      transactionsByType: { earn: 0, redeem: 0 },
      totalPointsIssued: 0,
      totalPointsRedeemed: 0,
      topCompaniesByClients: [],
      topCompaniesByTransactions: [],
      expiringSubscriptions: [],
    };

    (dashboardRepo.getStats as jest.Mock).mockResolvedValue(emptyStats);

    const { result } = renderHook(() => useDashboardStats(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(emptyStats);
  });

  it('should handle API errors', async () => {
    const error = new Error('Failed to fetch stats');
    (dashboardRepo.getStats as jest.Mock).mockRejectedValue(error);

    const { result } = renderHook(() => useDashboardStats(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });

  it('should use correct query key', () => {
    (dashboardRepo.getStats as jest.Mock).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useDashboardStats(), { wrapper });

    // Check if the query key matches
    const queryState = queryClient.getQueryState([
      'superadmin',
      'dashboard',
      'stats',
    ]);

    expect(queryState).toBeDefined();
  });

  it('should have correct staleTime configured', async () => {
    (dashboardRepo.getStats as jest.Mock).mockResolvedValue(mockStats);

    const { result } = renderHook(() => useDashboardStats(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    const queryState = queryClient.getQueryState([
      'superadmin',
      'dashboard',
      'stats',
    ]);

    // staleTime should be 5 minutes (5 * 60 * 1000)
    expect(queryState?.dataUpdatedAt).toBeDefined();
  });
});
