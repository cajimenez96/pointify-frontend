/**
 * useTransactionHistory Hook
 * Fetches and manages transaction history for admin
 */

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getTransactions,
  getClientTransactions,
} from '@/repositories/admin/transactions/transactions';
import type {
  Transaction,
  TransactionListResponse,
  TransactionType,
} from '@/repositories/admin/transactions/types';

interface UseTransactionHistoryParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  dni?: string;
}

interface UseTransactionHistoryReturn {
  transactions: Transaction[];
  totalTransactions: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: (params?: UseTransactionHistoryParams) => Promise<void>;
  fetchClientTransactions: (dni: string, params?: { page?: number; limit?: number }) => Promise<void>;
}

export function useTransactionHistory(): UseTransactionHistoryReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async (params?: UseTransactionHistoryParams) => {
    setIsLoading(true);
    setError(null);

    try {
      const data: TransactionListResponse = await getTransactions({
        page: params?.page || 1,
        limit: params?.limit || 10,
        type: params?.type,
      });

      setTransactions(data.data);
      setTotalTransactions(data.pagination.total);
      setTotalPages(data.pagination.totalPages);
      setCurrentPage(data.pagination.page);
    } catch (err: any) {
      const message = err.message || 'Error al cargar historial';
      setError(message);
      toast.error(message);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchClientTransactions = useCallback(
    async (dni: string, params?: { page?: number; limit?: number }) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getClientTransactions(dni, {
          page: params?.page || 1,
          limit: params?.limit || 10,
        });

        setTransactions(data);
        setTotalTransactions(data.length);
        setTotalPages(1);
        setCurrentPage(1);
      } catch (err: any) {
        const message = err.message || 'Error al cargar historial del cliente';
        setError(message);
        toast.error(message);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    transactions,
    totalTransactions,
    totalPages,
    currentPage,
    isLoading,
    error,
    fetchTransactions,
    fetchClientTransactions,
  };
}
