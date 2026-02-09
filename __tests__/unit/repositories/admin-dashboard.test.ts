/**
 * Unit tests for Admin Dashboard Repository
 * Tests API calls and error handling for dashboard stats and clients
 */

import {
  getDashboardStats,
  getClients,
} from '@/repositories/admin/dashboard/dashboard';
import { DashboardError } from '@/repositories/admin/dashboard/types';
import type { DashboardStats, ClientSummary } from '@/repositories/admin/dashboard/types';

// Mock apiClient
jest.mock('@/lib/api-client', () => {
  const mock = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    __esModule: true,
    default: mock,
    apiClient: mock,
  };
});

import { apiClient } from '@/lib/api-client';

const mockGet = apiClient.get as jest.Mock;

describe('Admin Dashboard Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getDashboardStats', () => {
    const mockStats: DashboardStats = {
      totalClients: 150,
      totalTransactions: 500,
      totalPointsIssued: 15000,
      recentTransactions: [],
    };

    it('should call GET /dashboard/stats and return stats', async () => {
      mockGet.mockResolvedValue({ data: mockStats });

      const result = await getDashboardStats();

      expect(mockGet).toHaveBeenCalledWith('/dashboard/stats');
      expect(result).toEqual(mockStats);
      expect(result.totalClients).toBe(150);
      expect(result.totalTransactions).toBe(500);
      expect(result.totalPointsIssued).toBe(15000);
    });

    it('should throw DashboardError on 403 forbidden', async () => {
      const axiosError = new Error('Forbidden') as any;
      axiosError.response = {
        status: 403,
        data: {
          statusCode: 403,
          message: 'No tienes permisos para ver estadísticas',
          error: 'Forbidden',
        },
      };

      mockGet.mockRejectedValue(axiosError);

      try {
        await getDashboardStats();
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DashboardError);
        expect((error as DashboardError).message).toBe(
          'No tienes permisos para ver estadísticas'
        );
        expect((error as DashboardError).statusCode).toBe(403);
      }
    });

    it('should throw DashboardError on network error', async () => {
      mockGet.mockRejectedValue(new Error('Network Error'));

      try {
        await getDashboardStats();
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DashboardError);
        expect((error as DashboardError).message).toBe(
          'Error de conexión con el servidor'
        );
        expect((error as DashboardError).statusCode).toBe(500);
      }
    });

    it('should join array messages with comma', async () => {
      const axiosError = new Error('Bad Request') as any;
      axiosError.response = {
        status: 400,
        data: {
          statusCode: 400,
          message: ['error 1', 'error 2'],
          error: 'Bad Request',
        },
      };

      mockGet.mockRejectedValue(axiosError);

      try {
        await getDashboardStats();
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DashboardError);
        expect((error as DashboardError).message).toBe('error 1, error 2');
      }
    });
  });

  describe('getClients', () => {
    const mockClients: ClientSummary[] = [
      { _id: 'c1', status: 'ACTIVE', currentPoints: 100 },
      { _id: 'c2', status: 'PENDING', currentPoints: 0 },
      { _id: 'c3', status: 'ACTIVE', currentPoints: 250 },
    ];

    it('should call GET /clients and return client list', async () => {
      mockGet.mockResolvedValue({ data: mockClients });

      const result = await getClients();

      expect(mockGet).toHaveBeenCalledWith('/clients');
      expect(result).toEqual(mockClients);
      expect(result).toHaveLength(3);
    });

    it('should throw DashboardError on API error', async () => {
      const axiosError = new Error('Forbidden') as any;
      axiosError.response = {
        status: 403,
        data: {
          statusCode: 403,
          message: 'No tienes permisos',
          error: 'Forbidden',
        },
      };

      mockGet.mockRejectedValue(axiosError);

      try {
        await getClients();
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DashboardError);
        expect((error as DashboardError).statusCode).toBe(403);
      }
    });

    it('should throw DashboardError on network error', async () => {
      mockGet.mockRejectedValue(new Error('Connection refused'));

      try {
        await getClients();
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(DashboardError);
        expect((error as DashboardError).message).toBe(
          'Error de conexión con el servidor'
        );
      }
    });
  });
});
