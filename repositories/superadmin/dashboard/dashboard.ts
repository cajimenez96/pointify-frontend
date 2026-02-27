/**
 * SuperAdmin Dashboard Repository
 * Handles API calls for global platform statistics
 */

import { apiClient } from '@/lib/api-client';
import { DashboardStats, DashboardError, ApiError } from './types';

/**
 * Fetch global platform statistics
 * Endpoint: GET /superadmin/dashboard/stats
 * Auth: SuperAdmin only
 */
export async function getStats(): Promise<DashboardStats> {
  try {
    const response = await apiClient.get<DashboardStats>(
      '/superadmin/dashboard/stats'
    );
    return response.data;
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
