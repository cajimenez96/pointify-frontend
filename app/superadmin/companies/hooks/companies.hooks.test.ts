/**
 * Tests for Companies Hooks
 * Combined tests for useCompanies, useCreateCompany, and useUpdateCompany
 */

import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCompaniesQuery } from './useCompanies';
import { useCreateCompanyMutation } from './useCreateCompany';
import { useUpdateCompanyMutation } from './useUpdateCompany';
import * as companiesRepo from '@/repositories/superadmin/companies/companies';

// Mock the repository
jest.mock('@/repositories/superadmin/companies/companies');

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Companies Hooks', () => {
  let queryClient: QueryClient;

  const mockCompany = {
    _id: '507f1f77bcf86cd799439011',
    companyCode: 'ESP001',
    businessName: 'Empresa Test',
    cuitCuil: '20-12345678-9',
    address: 'Calle Test 123',
    email: 'test@empresa.com',
    defaultPoints: 10,
    subscriptionEndDate: '2025-12-31',
    maxUsers: 50,
    isActive: true,
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  describe('useCompaniesQuery', () => {
    it('should fetch companies successfully', async () => {
      const mockResponse = {
        data: [mockCompany],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };

      (companiesRepo.getCompanies as jest.Mock).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useCompaniesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockResponse);
    });

    it('should handle errors', async () => {
      (companiesRepo.getCompanies as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch'),
      );

      const { result } = renderHook(() => useCompaniesQuery(), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });

    it('should use correct query key with filters', () => {
      const filters = { businessName: 'Test', isActive: true };
      (companiesRepo.getCompanies as jest.Mock).mockResolvedValue({
        data: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      });

      renderHook(() => useCompaniesQuery(filters), { wrapper });

      const queryState = queryClient.getQueryState(['companies', filters]);
      expect(queryState).toBeDefined();
    });
  });

  describe('useCreateCompanyMutation', () => {
    it('should create company successfully', async () => {
      (companiesRepo.createCompany as jest.Mock).mockResolvedValue(mockCompany);

      const { result } = renderHook(() => useCreateCompanyMutation(), { wrapper });

      result.current.mutate({
        companyCode: 'ESP001',
        businessName: 'Empresa Test',
        cuitCuil: '20-12345678-9',
        address: 'Calle Test 123',
        email: 'test@empresa.com',
        defaultPoints: 10,
        subscriptionEndDate: new Date('2025-12-31'),
        maxUsers: 50,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(companiesRepo.createCompany).toHaveBeenCalled();
    });

    it('should handle creation errors', async () => {
      (companiesRepo.createCompany as jest.Mock).mockRejectedValue(
        new Error('Company code already exists'),
      );

      const { result } = renderHook(() => useCreateCompanyMutation(), { wrapper });

      result.current.mutate({
        companyCode: 'ESP001',
        businessName: 'Empresa Test',
        cuitCuil: '20-12345678-9',
        address: 'Calle Test 123',
        email: 'test@empresa.com',
        defaultPoints: 10,
        subscriptionEndDate: new Date('2025-12-31'),
        maxUsers: 50,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('useUpdateCompanyMutation', () => {
    it('should update company successfully', async () => {
      const updatedCompany = { ...mockCompany, businessName: 'Updated Name' };
      (companiesRepo.updateCompany as jest.Mock).mockResolvedValue(updatedCompany);

      const { result } = renderHook(() => useUpdateCompanyMutation(), { wrapper });

      result.current.mutate({
        id: '507f1f77bcf86cd799439011',
        dto: { businessName: 'Updated Name' },
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // The hook calls the repository with id and updates
      expect(companiesRepo.updateCompany).toHaveBeenCalled();
    });

    it('should handle update errors', async () => {
      (companiesRepo.updateCompany as jest.Mock).mockRejectedValue(
        new Error('Company not found'),
      );

      const { result } = renderHook(() => useUpdateCompanyMutation(), { wrapper });

      result.current.mutate({
        id: 'invalid-id',
        dto: { businessName: 'Updated Name' },
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });
});
