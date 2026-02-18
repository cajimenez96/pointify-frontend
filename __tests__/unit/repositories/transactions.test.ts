/**
 * Unit tests for Transactions Repository
 * Tests earn, redeem, getTransactions, getClientTransactions
 */

import {
  earnPoints,
  redeemPoints,
  getTransactions,
  getClientTransactions,
} from '@/repositories/transactions/transactions';
import { TransactionError } from '@/repositories/transactions/types';
import type {
  EarnPointsDto,
  RedeemPointsDto,
  EarnResponse,
  RedeemResponse,
  TransactionListResponse,
  Transaction,
} from '@/repositories/transactions/types';

// Mock apiClient
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api-client';

const mockGet = apiClient.get as jest.Mock;
const mockPost = apiClient.post as jest.Mock;

describe('Transactions Repository', () => {
  const mockTransaction: Transaction = {
    _id: 'tx1',
    companyId: 'comp1',
    type: 'EARN',
    dni: '33333333',
    clientId: 'client1',
    points: 10,
    saleCode: 'SALE-001',
    productName: 'Café Espresso',
    userId: 'user1',
    createdAt: '2026-02-01T10:00:00Z',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('earnPoints', () => {
    const earnDto: EarnPointsDto = {
      dni: '33333333',
      saleCode: 'SALE-001',
      productName: 'Café Espresso',
    };

    const mockEarnResponse: EarnResponse = {
      success: true,
      transaction: mockTransaction,
      client: {
        dni: '33333333',
        name: 'Juan Pérez',
        status: 'ACTIVE',
        currentPoints: 25,
        totalAccumulated: 25,
      },
      pointsAdded: 10,
      message: '+10 puntos por Café Espresso',
    };

    it('should earn points successfully', async () => {
      mockPost.mockResolvedValue({ data: mockEarnResponse });

      const result = await earnPoints(earnDto);

      expect(mockPost).toHaveBeenCalledWith('/transactions/earn', earnDto);
      expect(result).toEqual(mockEarnResponse);
      expect(result.pointsAdded).toBe(10);
    });

    it('should throw TransactionError on 400 with API message', async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'Campaña no activa' },
        },
      });

      await expect(earnPoints(earnDto)).rejects.toThrow(TransactionError);
      try {
        await earnPoints(earnDto);
      } catch (error) {
        // When API returns a message, the repository uses it directly
        expect((error as TransactionError).message).toBe('Campaña no activa');
        expect((error as TransactionError).statusCode).toBe(400);
      }
    });

    it('should use fallback message on 400 without API message', async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 400,
          data: {},
        },
      });

      try {
        await earnPoints(earnDto);
      } catch (error) {
        expect((error as TransactionError).message).toBe(
          'Campaña inactiva o producto no configurado'
        );
      }
    });

    it('should throw TransactionError on 409 duplicate saleCode', async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 409,
          data: { message: 'Código de venta duplicado' },
        },
      });

      try {
        await earnPoints(earnDto);
      } catch (error) {
        expect(error).toBeInstanceOf(TransactionError);
        expect((error as TransactionError).message).toBe(
          'Código de venta duplicado'
        );
        expect((error as TransactionError).statusCode).toBe(409);
      }
    });

    it('should throw TransactionError on 402 subscription expired', async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 402,
          data: { message: 'Suscripción expirada' },
        },
      });

      try {
        await earnPoints(earnDto);
      } catch (error) {
        expect(error).toBeInstanceOf(TransactionError);
        expect((error as TransactionError).message).toBe(
          'Suscripción expirada'
        );
      }
    });

    it('should handle network errors', async () => {
      mockPost.mockRejectedValue(new Error('Network Error'));

      try {
        await earnPoints(earnDto);
      } catch (error) {
        expect(error).toBeInstanceOf(TransactionError);
        expect((error as TransactionError).statusCode).toBe(500);
      }
    });
  });

  describe('redeemPoints', () => {
    const redeemDto: RedeemPointsDto = {
      dni: '33333333',
      rewardId: 'reward1',
    };

    const mockRedeemResponse: RedeemResponse = {
      success: true,
      transaction: {
        ...mockTransaction,
        type: 'REDEEM',
        points: 50,
        rewardId: 'reward1',
        rewardName: 'Café Gratis',
        saleCode: undefined,
        productName: undefined,
      },
      client: {
        dni: '33333333',
        name: 'Juan Pérez',
        status: 'ACTIVE',
        currentPoints: 25,
        totalAccumulated: 75,
      },
      reward: {
        name: 'Café Gratis',
        pointsCost: 50,
        stockRemaining: 19,
      },
      message: "Premio 'Café Gratis' canjeado exitosamente",
    };

    it('should redeem points successfully', async () => {
      mockPost.mockResolvedValue({ data: mockRedeemResponse });

      const result = await redeemPoints(redeemDto);

      expect(mockPost).toHaveBeenCalledWith('/transactions/redeem', redeemDto);
      expect(result).toEqual(mockRedeemResponse);
      expect(result.reward.stockRemaining).toBe(19);
    });

    it('should throw TransactionError on 404 client not found', async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 404,
          data: { message: 'Cliente no encontrado' },
        },
      });

      try {
        await redeemPoints(redeemDto);
      } catch (error) {
        expect(error).toBeInstanceOf(TransactionError);
        expect((error as TransactionError).message).toBe(
          'Cliente no encontrado'
        );
      }
    });

    it('should throw TransactionError on 400 insufficient balance', async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'saldo insuficiente para canjear' },
        },
      });

      try {
        await redeemPoints(redeemDto);
      } catch (error) {
        expect(error).toBeInstanceOf(TransactionError);
        expect((error as TransactionError).message).toBe(
          'Saldo insuficiente para canjear este premio'
        );
      }
    });

    it('should throw TransactionError on 400 out of stock', async () => {
      mockPost.mockRejectedValue({
        response: {
          status: 400,
          data: { message: 'stock agotado' },
        },
      });

      try {
        await redeemPoints(redeemDto);
      } catch (error) {
        expect(error).toBeInstanceOf(TransactionError);
        expect((error as TransactionError).message).toBe(
          'Premio sin stock disponible'
        );
      }
    });
  });

  describe('getTransactions', () => {
    const mockListResponse: TransactionListResponse = {
      data: [mockTransaction],
      pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };

    it('should fetch transactions with default params', async () => {
      mockGet.mockResolvedValue({ data: mockListResponse });

      const result = await getTransactions();

      expect(mockGet).toHaveBeenCalledWith('/transactions', { params: {} });
      expect(result).toEqual(mockListResponse);
    });

    it('should pass query params correctly', async () => {
      mockGet.mockResolvedValue({ data: mockListResponse });

      await getTransactions({ page: 2, limit: 10, type: 'EARN' });

      expect(mockGet).toHaveBeenCalledWith('/transactions', {
        params: { page: 2, limit: 10, type: 'EARN' },
      });
    });

    it('should throw TransactionError on failure', async () => {
      mockGet.mockRejectedValue({
        response: { status: 500 },
      });

      await expect(getTransactions()).rejects.toThrow(TransactionError);
      try {
        await getTransactions();
      } catch (error) {
        expect((error as TransactionError).message).toBe(
          'Error al cargar historial de transacciones'
        );
      }
    });
  });

  describe('getClientTransactions', () => {
    const mockClientTx: Transaction[] = [mockTransaction];

    it('should fetch client transactions by DNI', async () => {
      mockGet.mockResolvedValue({ data: mockClientTx });

      const result = await getClientTransactions('33333333');

      expect(mockGet).toHaveBeenCalledWith('/transactions/client/33333333', {
        params: {},
      });
      expect(result).toEqual(mockClientTx);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should pass pagination params', async () => {
      mockGet.mockResolvedValue({ data: mockClientTx });

      await getClientTransactions('33333333', { page: 2, limit: 5 });

      expect(mockGet).toHaveBeenCalledWith('/transactions/client/33333333', {
        params: { page: 2, limit: 5 },
      });
    });

    it('should throw TransactionError on failure', async () => {
      mockGet.mockRejectedValue({
        response: { status: 404 },
      });

      await expect(getClientTransactions('99999999')).rejects.toThrow(
        TransactionError
      );
      try {
        await getClientTransactions('99999999');
      } catch (error) {
        expect((error as TransactionError).message).toBe(
          'Error al cargar historial del cliente'
        );
      }
    });
  });
});
