/**
 * Types and DTOs for SuperAdmin Companies API
 * Based on backend documentation
 */

// ============================================================================
// BASE INTERFACES
// ============================================================================

export interface ContactInfo {
  name: string;
  phone: string;
  email: string;
}

export interface Company {
  _id: string;
  companyCode: string;
  businessName: string;
  cuitCuil: string;
  address?: string;
  contactInfo: ContactInfo;
  isActive: boolean;
  subscriptionEndDate: string | null;
  maxUsers: number;
  maxClients: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// DTOs (Data Transfer Objects)
// ============================================================================

export interface CreateCompanyDto {
  companyCode: string; // min: 3, max: 20
  businessName: string; // min: 2, max: 200
  cuitCuil: string; // exactly 11 digits
  address?: string;
  contactInfo: {
    name: string;
    phone: string;
    email: string;
  };
  subscriptionEndDate?: string | null; // ISO date string or null for unlimited
  maxUsers?: number; // 0 = no limit
  maxClients?: number; // 0 = no limit
}

export interface UpdateCompanyDto {
  businessName?: string;
  address?: string;
  contactInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  subscriptionEndDate?: string | null;
  maxUsers?: number;
  maxClients?: number;
  isActive?: boolean;
  // NOTE: companyCode and cuitCuil cannot be modified after creation
}

export interface QueryCompaniesDto {
  businessName?: string; // partial search, case-insensitive
  cuitCuil?: string; // exact match
  isActive?: boolean;
  page?: number; // min: 1, default: 1
  limit?: number; // min: 1, max: 100, default: 20
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CompaniesListResponse {
  data: Company[];
  pagination: PaginationMeta;
}

export interface CompanyResponse extends Company {}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class CompanyError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'CompanyError';
  }
}
