/**
 * Types and DTOs for Admin Dashboard API
 * Endpoint: GET /dashboard/stats
 */

// ============================================================================
// DASHBOARD STATS (from /dashboard/stats)
// ============================================================================

export interface DashboardStats {
  totalClients: number;
  totalTransactions: number;
  totalPointsIssued: number;
  recentTransactions: RecentTransaction[];
}

export interface RecentTransaction {
  _id: string;
  type: 'EARN' | 'REDEEM';
  points: number;
  productName?: string;
  saleCode?: string;
  rewardId?: string;
  rewardName?: string;
  clientId: {
    name: string;
    dni: string;
  };
  cashierId: {
    name: string;
  };
  createdAt: string;
}

// ============================================================================
// COMPUTED DASHBOARD DATA
// ============================================================================

import type { Client } from '../clients/types';

export interface DashboardComputedData {
  stats: DashboardStats;
  clients: Client[];
  activeClients: number;
  shadowClients: number;
  conversionRate: number;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class DashboardError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'DashboardError';
  }
}
