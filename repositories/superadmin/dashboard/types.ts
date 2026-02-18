/**
 * Types and DTOs for SuperAdmin Dashboard API
 * Endpoint: GET /superadmin/dashboard/stats
 */

// ============================================================================
// BASE INTERFACES
// ============================================================================

export interface UsersByRole {
  superadmin: number;
  admin: number;
  cashier: number;
}

export interface TransactionsByType {
  earn: number;
  redeem: number;
}

export interface TopCompany {
  _id: string;
  companyCode: string;
  businessName: string;
  isActive: boolean;
  clientCount?: number;
  transactionCount?: number;
}

export interface ExpiringSubscription {
  _id: string;
  companyCode: string;
  businessName: string;
  subscriptionEndDate: string;
  daysRemaining: number;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface DashboardStats {
  // Companies
  totalCompanies: number;
  activeCompanies: number;
  inactiveCompanies: number;
  newCompaniesThisMonth: number;

  // Users
  totalUsers: number;
  usersByRole: UsersByRole;

  // Clients
  totalClients: number;
  newClientsThisMonth: number;

  // Transactions
  totalTransactions: number;
  transactionsByType: TransactionsByType;

  // Points Economy
  totalPointsIssued: number;
  totalPointsRedeemed: number;

  // Rankings
  topCompaniesByClients: TopCompany[];
  topCompaniesByTransactions: TopCompany[];

  // Alerts
  expiringSubscriptions: ExpiringSubscription[];
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
