/**
 * Transactions Repository - API Functions
 * Handles point earning and redemption operations
 */

import { apiClient } from '@/lib/api-client';
import type {
  EarnPointsDto,
  RedeemPointsDto,
  EarnResponse,
  RedeemResponse,
  Transaction,
  TransactionListResponse,
  QueryTransactionsDto,
  TransactionError,
} from './types';

// ============================================================================
// EARN POINTS (ADD)
// ============================================================================

/**
 * Register a sale and add points to client
 * Creates client automatically if doesn't exist (Shadow User)
 */
export async function earnPoints(dto: EarnPointsDto): Promise<EarnResponse> {
  try {
    const { data } = await apiClient.post<EarnResponse>(
      '/transactions/earn',
      dto
    );
    return data;
  } catch (error: any) {
    const status = error.response?.status;
    const message =
      status === 400
        ? error.response?.data?.message || 'Campaña inactiva o producto no configurado'
        : status === 402
        ? 'Suscripción expirada'
        : status === 409
        ? 'Código de venta duplicado'
        : 'Error al registrar venta';

    throw new TransactionError(
      message,
      status || 500,
      error.response?.data
    );
  }
}

// ============================================================================
// REDEEM POINTS (SPEND)
// ============================================================================

/**
 * Redeem points for a reward from the catalog
 * Atomic operation: validates balance + stock, then deducts both
 */
export async function redeemPoints(
  dto: RedeemPointsDto
): Promise<RedeemResponse> {
  try {
    const { data } = await apiClient.post<RedeemResponse>(
      '/transactions/redeem',
      dto
    );
    return data;
  } catch (error: any) {
    const status = error.response?.status;
    const responseData = error.response?.data;

    const message =
      status === 404
        ? responseData?.message || 'Cliente o premio no encontrado'
        : status === 400 && responseData?.message?.includes('stock')
        ? 'Premio sin stock disponible'
        : status === 400 && responseData?.message?.includes('saldo')
        ? 'Saldo insuficiente para canjear este premio'
        : status === 402
        ? 'Suscripción expirada'
        : 'Error al canjear premio';

    throw new TransactionError(
      message,
      status || 500,
      error.response?.data
    );
  }
}

// ============================================================================
// TRANSACTION HISTORY
// ============================================================================

/**
 * Get paginated transaction history with optional type filter
 */
export async function getTransactions(
  query: QueryTransactionsDto = {}
): Promise<TransactionListResponse> {
  try {
    const { data } = await apiClient.get<TransactionListResponse>(
      '/transactions',
      { params: query }
    );
    return data;
  } catch (error: any) {
    throw new TransactionError(
      'Error al cargar historial de transacciones',
      error.response?.status || 500
    );
  }
}

/**
 * Get transaction history for a specific client
 */
export async function getClientTransactions(
  dni: string
): Promise<Transaction[]> {
  try {
    const { data } = await apiClient.get<Transaction[]>(
      `/transactions/client/${dni}`
    );
    return data;
  } catch (error: any) {
    throw new TransactionError(
      'Error al cargar historial del cliente',
      error.response?.status || 500
    );
  }
}
