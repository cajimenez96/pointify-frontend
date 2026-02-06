/**
 * Settings Repository - Types and DTOs
 * Manages product points configuration and rewards catalog
 */

// ============================================================================
// PRODUCT CONFIGURATION
// ============================================================================

export interface ProductPoints {
  productName: string;
  pointsValue: number;
  isActive: boolean;
}

export interface CreateProductDto {
  productName: string; // Unique per company
  pointsValue: number; // Minimum 1
}

export interface UpdateProductPointsDto {
  pointsValue: number; // Minimum 1
}

// ============================================================================
// REWARDS CATALOG
// ============================================================================

export interface Reward {
  _id: string;
  name: string;
  description?: string;
  pointsCost: number;
  stock: number | null; // null = unlimited stock
  imageUrl?: string;
  isActive: boolean;
}

export interface CreateRewardDto {
  name: string;
  description?: string;
  pointsCost: number; // Minimum 1
  stock?: number | null; // null = unlimited
  imageUrl?: string;
}

export interface UpdateRewardDto {
  name?: string;
  description?: string;
  pointsCost?: number;
  stock?: number | null;
  imageUrl?: string;
  isActive?: boolean; // For soft delete
}

// ============================================================================
// SETTINGS ENTITY
// ============================================================================

export interface Settings {
  _id: string;
  companyId: string;
  pointsConfig: ProductPoints[];
  rewards: Reward[];
  isActive: boolean;
  campaignStartDate: string | null;
  campaignEndDate: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface SettingsApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class SettingsError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'SettingsError';
  }
}
