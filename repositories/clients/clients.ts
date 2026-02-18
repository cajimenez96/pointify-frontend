/**
 * Clients Repository - API Functions
 * PUBLIC endpoint for QR codes + Admin endpoints for client management
 */

import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import { ClientError } from './types';
import type {
  Client,
  ClientPublicResponse,
  RegisterClientDto,
  CompleteProfileDto,
  CompleteProfileResponse,
} from './types';

// ============================================================================
// PUBLIC ENDPOINTS (No Auth Required)
// ============================================================================

/**
 * Get client with rewards for public view (QR code)
 * NO AUTHENTICATION REQUIRED - Public endpoint
 * 
 * @param dni - Client DNI
 * @param companyCode - Company code from QR parameter
 */
export async function getClientPublic(
  dni: string,
  companyCode: string
): Promise<ClientPublicResponse> {
  try {
    const { data } = await axios.get<ClientPublicResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/${dni}`,
      {
        params: { companyCode },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error: any) {
    const status = error.response?.status;
    const message =
      status === 400
        ? 'Código de empresa inválido'
        : status === 404
        ? 'Empresa no encontrada'
        : 'Error al consultar cliente';

    throw new ClientError(
      message,
      status || 500,
      error.response?.data
    );
  }
}

/**
 * Register a new client (public endpoint)
 * NO AUTHENTICATION REQUIRED
 */
export async function registerClient(
  dto: RegisterClientDto
): Promise<Client> {
  try {
    const { data } = await axios.post<Client>(
      `${process.env.NEXT_PUBLIC_API_URL}/clients`,
      dto,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error: any) {
    throw new ClientError(
      'Error al registrar cliente',
      error.response?.status || 500,
      error.response?.data
    );
  }
}

/**
 * Complete profile of a Shadow User (public endpoint)
 * Used when a client created via EARN transaction fills their data
 * NO AUTHENTICATION REQUIRED
 */
export async function completeProfile(
  dto: CompleteProfileDto
): Promise<CompleteProfileResponse> {
  try {
    const { data } = await axios.post<CompleteProfileResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/complete-profile`,
      dto,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return data;
  } catch (error: any) {
    const message =
      error.response?.status === 404
        ? 'Cliente no encontrado o perfil ya completo'
        : 'Error al completar perfil';

    throw new ClientError(
      message,
      error.response?.status || 500,
      error.response?.data
    );
  }
}

// ============================================================================
// ADMIN ENDPOINTS (Auth Required)
// ============================================================================

/**
 * Get all clients for the company (admin only)
 */
export async function getClients(): Promise<Client[]> {
  try {
    const { data } = await apiClient.get<Client[]>('/clients');
    return data;
  } catch (error: any) {
    throw new ClientError(
      'Error al cargar clientes',
      error.response?.status || 500
    );
  }
}

/**
 * Get a specific client by DNI (admin only)
 */
export async function getClientByDni(dni: string): Promise<Client> {
  try {
    const { data } = await apiClient.get<Client>(`/clients/${dni}`);
    return data;
  } catch (error: any) {
    throw new ClientError(
      'Cliente no encontrado',
      error.response?.status || 404
    );
  }
}
