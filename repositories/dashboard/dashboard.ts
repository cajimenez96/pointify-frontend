/**
 * Admin Dashboard Repository
 * Handles API calls for tenant dashboard statistics
 */

import { apiClient } from '@/lib/api-client';
import { DashboardStats, DashboardError, ApiError } from './types';

/**
 * Fetch dashboard statistics for the current tenant
 * Endpoint: GET /dashboard/stats
 * Auth: Admin only
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const { data } = await apiClient.get<DashboardStats>('/dashboard/stats');
    return data;
  } catch (error: any) {
    if (error.response) {
      const apiError = error.response.data as ApiError;
      throw new DashboardError(
        Array.isArray(apiError.message)
          ? apiError.message.join(', ')
          : apiError.message || 'Error al obtener estadísticas',
        error.response.status,
        apiError
      );
    }
    throw new DashboardError(
      'Error de conexión con el servidor',
      500,
      error
    );
  }
}

