/**
 * Settings Repository - API Functions
 * Handles products configuration and rewards catalog management
 */

import { apiClient } from '@/lib/api-client';
import { SettingsError } from './types';
import type {
  Settings,
  ProductPoints,
  CreateProductDto,
  UpdateProductPointsDto,
  Reward,
  CreateRewardDto,
  UpdateRewardDto,
} from './types';

// ============================================================================
// PRODUCTS API
// ============================================================================

/**
 * Get active products with their points configuration
 */
export async function getActiveProducts(): Promise<ProductPoints[]> {
  try {
    const { data } = await apiClient.get<ProductPoints[]>(
      '/settings/products/active'
    );
    return data;
  } catch (error: any) {
    throw new SettingsError(
      error.response?.data?.message || 'Error al cargar productos',
      error.response?.status || 500
    );
  }
}

/**
 * Create a new product with points configuration
 */
export async function createProduct(
  dto: CreateProductDto
): Promise<Settings> {
  try {
    const { data } = await apiClient.post<Settings>('/settings/products', dto);
    return data;
  } catch (error: any) {
    const message =
      error.response?.status === 400
        ? 'Producto ya existe o datos inválidos'
        : error.response?.status === 402
        ? 'Suscripción expirada'
        : 'Error al crear producto';

    throw new SettingsError(
      message,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Update points value for an existing product
 */
export async function updateProductPoints(
  productName: string,
  dto: UpdateProductPointsDto
): Promise<Settings> {
  try {
    const { data } = await apiClient.patch<Settings>(
      `/settings/products/${encodeURIComponent(productName)}/points`,
      dto
    );
    return data;
  } catch (error: any) {
    const message =
      error.response?.status === 404
        ? 'Producto no encontrado'
        : 'Error al actualizar producto';

    throw new SettingsError(message, error.response?.status || 500);
  }
}

/**
 * Delete a product from configuration
 */
export async function deleteProduct(productName: string): Promise<Settings> {
  try {
    const { data } = await apiClient.delete<Settings>(
      `/settings/products/${encodeURIComponent(productName)}`
    );
    return data;
  } catch (error: any) {
    throw new SettingsError(
      'Error al eliminar producto',
      error.response?.status || 500
    );
  }
}

// ============================================================================
// REWARDS API
// ============================================================================

/**
 * Get all active rewards with stock > 0
 */
export async function getActiveRewards(): Promise<Reward[]> {
  try {
    const { data } = await apiClient.get<Reward[]>('/settings/rewards/active');
    return data;
  } catch (error: any) {
    throw new SettingsError(
      'Error al cargar premios activos',
      error.response?.status || 500
    );
  }
}

/**
 * Get all rewards (including inactive)
 */
export async function getAllRewards(): Promise<Reward[]> {
  try {
    const { data } = await apiClient.get<Reward[]>('/settings/rewards');
    return data;
  } catch (error: any) {
    throw new SettingsError(
      'Error al cargar premios',
      error.response?.status || 500
    );
  }
}

/**
 * Create a new reward in the catalog
 */
export async function createReward(dto: CreateRewardDto): Promise<Settings> {
  try {
    const { data } = await apiClient.post<Settings>('/settings/rewards', dto);
    return data;
  } catch (error: any) {
    const message =
      error.response?.status === 400
        ? 'Datos de premio inválidos o nombre duplicado'
        : error.response?.status === 402
        ? 'Suscripción expirada'
        : 'Error al crear premio';

    throw new SettingsError(
      message,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Update an existing reward
 */
export async function updateReward(
  rewardId: string,
  dto: UpdateRewardDto
): Promise<Settings> {
  try {
    const { data } = await apiClient.patch<Settings>(
      `/settings/rewards/${rewardId}`,
      dto
    );
    return data;
  } catch (error: any) {
    const message =
      error.response?.status === 404
        ? 'Premio no encontrado'
        : 'Error al actualizar premio';

    throw new SettingsError(message, error.response?.status || 500);
  }
}

/**
 * Soft delete a reward (set isActive = false)
 */
export async function deleteReward(rewardId: string): Promise<Settings> {
  try {
    const { data } = await apiClient.delete<Settings>(
      `/settings/rewards/${rewardId}`
    );
    return data;
  } catch (error: any) {
    throw new SettingsError(
      'Error al eliminar premio',
      error.response?.status || 500
    );
  }
}

// ============================================================================
// FULL SETTINGS
// ============================================================================

/**
 * Get complete settings configuration
 */
export async function getSettings(): Promise<Settings> {
  try {
    const { data } = await apiClient.get<Settings>('/settings');
    return data;
  } catch (error: any) {
    throw new SettingsError(
      'Error al cargar configuración',
      error.response?.status || 500
    );
  }
}

/**
 * Update campaign settings (dates, active status)
 */
export async function updateCampaignSettings(dto: {
  isActive?: boolean;
  campaignStartDate?: string | null;
  campaignEndDate?: string | null;
}): Promise<Settings> {
  try {
    const { data } = await apiClient.patch<Settings>('/settings', dto);
    return data;
  } catch (error: any) {
    throw new SettingsError(
      'Error al actualizar campaña',
      error.response?.status || 500
    );
  }
}
