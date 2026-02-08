/**
 * Types and DTOs for Authentication API
 * Based on backend auth endpoints
 */

// ============================================================================
// REQUEST DTOs
// ============================================================================

export interface SuperAdminLoginDto {
  username: string;
  password: string;
}

export interface TenantLoginDto {
  companyCode: string;
  username: string;
  password: string;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  isSuperAdmin?: boolean;
  companyCode?: string;
  companyName?: string;
}

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface ApiError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AuthError';
  }
}
