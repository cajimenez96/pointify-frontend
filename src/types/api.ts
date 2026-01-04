// Type definitions basadas en los DTOs del backend

/**
 * Roles de usuario disponibles en el sistema
 */
export enum UserRole {
  ADMIN = 'admin',
  CASHIER = 'cashier',
}

/**
 * Usuario del sistema (Admin o Cajero)
 */
export interface User {
  id: string;
  dni: string;
  name: string;
  role: UserRole;
  isActive?: boolean;
}

/**
 * Cliente del programa de lealtad
 */
export interface Client {
  _id: string;
  dni: string;
  name: string;
  phone: string;
  email: string;
  currentPoints: number;
  totalAccumulated: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Transacción de puntos
 */
export interface Transaction {
  _id: string;
  clientId: string | Client;
  cashierId: string | User;
  saleCode: string;
  pointsAdded: number;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Configuración del sistema de recompensas
 */
export interface Settings {
  _id: string;
  key: string;
  pointsTarget: number;
  rewardName: string;
  minPurchaseAmount: number;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Estadísticas del dashboard
 */
export interface DashboardStats {
  totalClients: number;
  totalTransactions: number;
  totalPointsIssued: number;
  recentTransactions: Transaction[];
}

// ============= Request DTOs =============

/**
 * DTO para login
 */
export interface LoginRequest {
  dni: string;
  password: string;
}

/**
 * DTO para registro de cliente
 */
export interface CreateClientRequest {
  dni: string;
  name: string;
  phone?: string;
  email?: string;
}

/**
 * DTO para agregar puntos
 */
export interface AddPointsRequest {
  dni: string;
  saleCode: string;
}

/**
 * DTO para actualizar configuración
 */
export interface UpdateSettingsRequest {
  pointsTarget?: number;
  rewardName?: string;
  minPurchaseAmount?: number;
}

// ============= Response DTOs =============

/**
 * Respuesta de login
 */
export interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * Respuesta al agregar puntos
 */
export interface AddPointsResponse {
  success: boolean;
  client: {
    name: string;
    currentPoints: number;
    totalAccumulated: number;
  };
  rewardReached: boolean;
  rewardName: string;
  message: string;
}

/**
 * Error de API
 */
export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
