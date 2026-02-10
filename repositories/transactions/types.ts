/**
 * Transactions Repository - Types and DTOs
 * Handles EARN (add points) and REDEEM (spend points) operations
 */

// ============================================================================
// TRANSACTION TYPES
// ============================================================================

export type TransactionType = 'EARN' | 'REDEEM';

export interface Transaction {
  _id: string;
  companyId: string;
  type: TransactionType;
  dni: string;
  clientId: string;
  points: number;

  // EARN-specific fields
  saleCode?: string;
  productName?: string;

  // REDEEM-specific fields
  rewardId?: string;
  rewardName?: string;

  userId: string; // Cashier/admin who executed the transaction
  createdAt: string;
}

// ============================================================================
// DTOs (DATA TRANSFER OBJECTS)
// ============================================================================

export interface EarnPointsDto {
  dni: string; // Client DNI
  saleCode: string; // Unique sale code
  productName: string; // Product from pointsConfig
}

export interface RedeemPointsDto {
  dni: string; // Client DNI
  rewardId: string; // MongoDB ObjectId of the reward
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface ClientSummary {
  dni: string;
  name: string;
  status: 'ACTIVE' | 'PENDING';
  currentPoints: number;
  totalAccumulated: number;
}

export interface EarnResponse {
  success: boolean;
  transaction: Transaction;
  client: ClientSummary;
  pointsAdded: number;
  message: string; // e.g., "+10 puntos por Café Espresso"
}

export interface RedeemResponse {
  success: boolean;
  transaction: Transaction;
  client: ClientSummary;
  reward: {
    name: string;
    pointsCost: number;
    stockRemaining: number | null;
  };
  message: string; // e.g., "🎉 Premio 'Café Gratis' canjeado exitosamente"
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TransactionListResponse {
  data: Transaction[];
  pagination: PaginationMeta;
}

export interface QueryTransactionsDto {
  page?: number;
  limit?: number;
  type?: TransactionType;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface TransactionApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class TransactionError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}
