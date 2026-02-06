/**
 * Clients Repository - Types and DTOs
 * Handles client management and public client view (QR code)
 */

import type { Reward } from '../admin/settings/types';

// ============================================================================
// CLIENT TYPES
// ============================================================================

export type ClientStatus = 'ACTIVE' | 'PENDING';

export interface Client {
  _id: string;
  companyId: string;
  dni: string;
  name: string;
  email?: string;
  phone?: string;
  currentPoints: number; // Spendable balance
  totalAccumulated: number; // Historical total
  status: ClientStatus; // PENDING = Shadow User
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// PUBLIC CLIENT VIEW (QR CODE)
// ============================================================================

export interface RewardWithAffordability extends Reward {
  canAfford: boolean; // true if client points >= pointsCost
  pointsNeeded: number; // 0 if canAfford, else points needed
}

export interface CompanyInfo {
  companyCode: string;
  businessName: string;
}

export interface ClientPublicResponse {
  exists: boolean; // false if shadow user
  dni: string;
  name: string | null; // null if shadow user
  email?: string;
  phone?: string;
  currentPoints: number;
  totalAccumulated: number;
  status: ClientStatus;
  company: CompanyInfo;
  rewards: RewardWithAffordability[]; // Only active rewards with stock
}

// ============================================================================
// DTOs (DATA TRANSFER OBJECTS)
// ============================================================================

export interface RegisterClientDto {
  dni: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface CompleteProfileDto {
  dni: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface CompleteProfileResponse {
  message: string;
  client: {
    dni: string;
    name: string;
    status: ClientStatus;
    currentPoints: number;
  };
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ClientApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class ClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ClientError';
  }
}
