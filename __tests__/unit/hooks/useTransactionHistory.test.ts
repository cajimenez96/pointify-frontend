/**
 * Unit tests for useTransactionHistory hook
 * Tests paginated transaction fetching and client transaction fetching
 */

import { renderHook, waitFor, act } from '@testing-library/react';
import { useTransactionHistory } from '@/app/admin/hooks/useTransactionHistory';
import * as transactionsRepo from '@/repositories/transactions/transactions';
import type {
  Transaction,
  TransactionListResponse,
} from '@/repositories/transactions/types';

// Mock the repository
jest.mock('@/repositories/transactions/transactions');

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

import { toast } from 'sonner';

describe('useTransactionHistory', () => {
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

  const mockListResponse: TransactionListResponse = {
    data: [mockTransaction],
    pagination: { total: 50, page: 1, limit: 10, totalPages: 5 },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct default values', () => {
      const { result } = renderHook(() => useTransactionHistory());

      expect(result.current.transactions).toEqual([]);
      expect(result.current.totalTransactions).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('fetchTransactions', () => {
    it('should fetch transactions successfully', async () => {
      (transactionsRepo.getTransactions as jest.Mock).mockResolvedValue(
        mockListResponse
      );

      const { result } = renderHook(() => useTransactionHistory());

      await act(async () => {
        await result.current.fetchTransactions();
      });

      expect(result.current.transactions).toEqual([mockTransaction]);
      expect(result.current.totalTransactions).toBe(50);
      expect(result.current.totalPages).toBe(5);
      expect(result.current.currentPage).toBe(1);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should pass pagination and type params', async () => {
      (transactionsRepo.getTransactions as jest.Mock).mockResolvedValue(
        mockListResponse
      );

      const { result } = renderHook(() => useTransactionHistory());

      await act(async () => {
        await result.current.fetchTransactions({
          page: 3,
          limit: 20,
          type: 'REDEEM',
        });
      });

      expect(transactionsRepo.getTransactions).toHaveBeenCalledWith({
        page: 3,
        limit: 20,
        type: 'REDEEM',
      });
    });

    it('should use default page 1 and limit 10', async () => {
      (transactionsRepo.getTransactions as jest.Mock).mockResolvedValue(
        mockListResponse
      );

      const { result } = renderHook(() => useTransactionHistory());

      await act(async () => {
        await result.current.fetchTransactions();
      });

      expect(transactionsRepo.getTransactions).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        type: undefined,
      });
    });

    it('should handle errors and show toast', async () => {
      const error = new Error('Error al cargar historial');
      (transactionsRepo.getTransactions as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useTransactionHistory());

      await act(async () => {
        await result.current.fetchTransactions();
      });

      expect(result.current.error).toBe('Error al cargar historial');
      expect(result.current.transactions).toEqual([]);
      expect(result.current.isLoading).toBe(false);
      expect(toast.error).toHaveBeenCalledWith('Error al cargar historial');
    });

    it('should set isLoading during fetch', async () => {
      let resolvePromise: (value: TransactionListResponse) => void;
      const pendingPromise = new Promise<TransactionListResponse>((resolve) => {
        resolvePromise = resolve;
      });

      (transactionsRepo.getTransactions as jest.Mock).mockReturnValue(
        pendingPromise
      );

      const { result } = renderHook(() => useTransactionHistory());

      act(() => {
        result.current.fetchTransactions();
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await act(async () => {
        resolvePromise!(mockListResponse);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('fetchClientTransactions', () => {
    const mockClientTx: Transaction[] = [
      mockTransaction,
      {
        ...mockTransaction,
        _id: 'tx2',
        type: 'REDEEM',
        points: 50,
        rewardName: 'Café Gratis',
      },
    ];

    it('should fetch client transactions by DNI', async () => {
      (transactionsRepo.getClientTransactions as jest.Mock).mockResolvedValue(
        mockClientTx
      );

      const { result } = renderHook(() => useTransactionHistory());

      await act(async () => {
        await result.current.fetchClientTransactions('33333333');
      });

      expect(transactionsRepo.getClientTransactions).toHaveBeenCalledWith(
        '33333333',
        { page: 1, limit: 10 }
      );
      expect(result.current.transactions).toEqual(mockClientTx);
      expect(result.current.totalTransactions).toBe(2);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.currentPage).toBe(1);
    });

    it('should pass pagination params for client transactions', async () => {
      (transactionsRepo.getClientTransactions as jest.Mock).mockResolvedValue(
        mockClientTx
      );

      const { result } = renderHook(() => useTransactionHistory());

      await act(async () => {
        await result.current.fetchClientTransactions('33333333', {
          page: 2,
          limit: 5,
        });
      });

      expect(transactionsRepo.getClientTransactions).toHaveBeenCalledWith(
        '33333333',
        { page: 2, limit: 5 }
      );
    });

    it('should handle client transaction errors', async () => {
      const error = new Error('Error al cargar historial del cliente');
      (transactionsRepo.getClientTransactions as jest.Mock).mockRejectedValue(
        error
      );

      const { result } = renderHook(() => useTransactionHistory());

      await act(async () => {
        await result.current.fetchClientTransactions('99999999');
      });

      expect(result.current.error).toBe(
        'Error al cargar historial del cliente'
      );
      expect(result.current.transactions).toEqual([]);
      expect(toast.error).toHaveBeenCalledWith(
        'Error al cargar historial del cliente'
      );
    });
  });
});
