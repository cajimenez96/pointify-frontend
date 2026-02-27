/**
 * Unit tests for SuperAdmin Dashboard Repository
 * Tests API calls and error handling for getStats()
 */

import { getStats } from '@/repositories/superadmin/dashboard/dashboard';
import { DashboardError } from '@/repositories/superadmin/dashboard/types';
import type { DashboardStats } from '@/repositories/superadmin/dashboard/types';

// Mock apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

const mockGet = apiClient.get as jest.Mock;

describe('SuperAdmin Dashboard Repository', () => {
  const mockStats: DashboardStats = {
    totalCompanies: 10,
    activeCompanies: 8,
    inactiveCompanies: 2,
    newCompaniesThisMonth: 3,
    totalUsers: 14,
    usersByRole: { superadmin: 1, admin: 5, cashier: 8 },
    totalClients: 150,
    newClientsThisMonth: 25,
    totalTransactions: 500,
    transactionsByType: { earn: 300, redeem: 200 },
    totalPointsIssued: 15000,
    totalPointsRedeemed: 8000,
    topCompaniesByClients: [
      {
        _id: 'c1',
        companyCode: 'ESP001',
        businessName: 'Empresa 1',
        isActive: true,
        clientCount: 50,
      },
    ],
    topCompaniesByTransactions: [
      {
        _id: 'c1',
        companyCode: 'ESP001',
        businessName: 'Empresa 1',
        isActive: true,
        transactionCount: 200,
      },
    ],
    expiringSubscriptions: [
      {
        _id: 'c2',
        companyCode: 'ESP002',
        businessName: 'Empresa 2',
        subscriptionEndDate: '2026-03-01T00:00:00Z',
        daysRemaining: 15,
      },
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should fetch dashboard stats successfully', async () => {
      mockGet.mockResolvedValue({ data: mockStats });

      const result = await getStats();

      expect(mockGet).toHaveBeenCalledWith('/superadmin/dashboard/stats');
      expect(result).toEqual(mockStats);
    });

    it('should return all expected fields', async () => {
      mockGet.mockResolvedValue({ data: mockStats });

      const result = await getStats();

      expect(result).toHaveProperty('totalCompanies');
      expect(result).toHaveProperty('activeCompanies');
      expect(result).toHaveProperty('usersByRole');
      expect(result).toHaveProperty('transactionsByType');
      expect(result).toHaveProperty('topCompaniesByClients');
      expect(result).toHaveProperty('topCompaniesByTransactions');
      expect(result).toHaveProperty('expiringSubscriptions');
    });

    it('should throw DashboardError on API error with response', async () => {
      mockGet.mockRejectedValue({
        response: {
          status: 403,
          data: {
            statusCode: 403,
            message: 'Se requieren permisos de SuperAdmin',
            error: 'Forbidden',
          },
        },
      });

      await expect(getStats()).rejects.toThrow(DashboardError);
      await expect(getStats()).rejects.toThrow(
        'Se requieren permisos de SuperAdmin'
      );
    });

    it('should handle array error messages from API', async () => {
      mockGet.mockRejectedValue({
        response: {
          status: 400,
          data: {
            statusCode: 400,
            message: ['Field 1 is invalid', 'Field 2 is required'],
            error: 'Bad Request',
          },
        },
      });

      try {
        await getStats();
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DashboardError);
        expect((error as DashboardError).message).toBe(
          'Field 1 is invalid, Field 2 is required'
        );
        expect((error as DashboardError).statusCode).toBe(400);
      }
    });

    it('should throw DashboardError on network error', async () => {
      mockGet.mockRejectedValue(new Error('Network Error'));

      await expect(getStats()).rejects.toThrow(DashboardError);
      await expect(getStats()).rejects.toThrow(
        'Error de conexión con el servidor'
      );
    });

    it('should include status code in DashboardError', async () => {
      mockGet.mockRejectedValue({
        response: {
          status: 500,
          data: {
            statusCode: 500,
            message: 'Internal Server Error',
            error: 'Internal Server Error',
          },
        },
      });

      try {
        await getStats();
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DashboardError);
        expect((error as DashboardError).statusCode).toBe(500);
      }
    });
  });
});
