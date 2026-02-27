/**
 * Auth Repository
 * Handles all API calls for authentication
 */

import apiClient from '@/lib/api-client';
import { AuthError } from './types';
import type {
  SuperAdminLoginDto,
  TenantLoginDto,
  LoginResponse,
  ApiError,
} from './types';

/**
 * Login as SuperAdmin
 * @throws {AuthError} If login fails
 */
export async function loginSuperAdmin(
  dto: SuperAdminLoginDto
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(
      '/auth/superadmin/login',
      dto
    );
    return response.data;
  } catch (error: unknown) {
    throw handleAuthError(error);
  }
}

/**
 * Login as Tenant (Admin/Cashier)
 * @throws {AuthError} If login fails
 */
export async function loginTenant(
  dto: TenantLoginDto
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      dto
    );
    return response.data;
  } catch (error: unknown) {
    throw handleAuthError(error);
  }
}

/**
 * Handles API errors and converts them to AuthError
 */
function handleAuthError(error: unknown): AuthError {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as {
      response?: { data?: ApiError; status?: number };
    };

    if (axiosError.response?.data) {
      const apiError = axiosError.response.data;
      const message = Array.isArray(apiError.message)
        ? apiError.message.join(', ')
        : apiError.message;

      return new AuthError(message, apiError.statusCode, apiError);
    }
  }

  return new AuthError(
    error instanceof Error ? error.message : 'Error desconocido',
    500
  );
}
