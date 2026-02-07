import axios from 'axios';

/**
 * Crea un mock del API client para testing
 */
export function createMockApiClient() {
  const mockAxios = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
      response: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
  };

  return mockAxios;
}

/**
 * Mock de respuesta exitosa para endpoints de login
 */
export const mockLoginSuccess = (role: 'superadmin' | 'admin' | 'cashier') => {
  return {
    data: {
      access_token: 'mock-jwt-token',  // Backend usa snake_case
      user: {
        id: 'mock-user-id',
        username: role === 'superadmin' ? 'superadmin' : 'admin',
        name: role === 'superadmin' ? 'Super Admin' : 'Admin Usuario',
        role: role,
        ...(role !== 'superadmin' && {
          companyCode: 'DEFAULT',
          companyName: 'Empresa Demo',
          dni: '12345678',
        }),
        isSuperAdmin: role === 'superadmin',
        isActive: true,
      },
    },
  };
};

/**
 * Mock de error de autenticación
 */
export const mockLoginError = (message = 'Credenciales inválidas') => {
  return {
    response: {
      status: 401,
      data: {
        message,
        statusCode: 401,
        error: 'Unauthorized',
      },
    },
  };
};

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Factory: Mock DashboardStats
 */
export function mockDashboardStats(overrides: Record<string, unknown> = {}) {
  return {
    totalCompanies: 10,
    activeCompanies: 8,
    inactiveCompanies: 2,
    newCompaniesThisMonth: 3,
    totalUsers: 14,
    usersByRole: { superadmin: 1, admin: 5, cashier: 8 },
    totalClients: 150,
    newClientsThisMonth: 25,
    totalTransactions: 500,
    transactionsByType: { earn: 300, redeem: 200 },
    totalPointsIssued: 15000,
    totalPointsRedeemed: 8000,
    topCompaniesByClients: [],
    topCompaniesByTransactions: [],
    expiringSubscriptions: [],
    ...overrides,
  };
}

/**
 * Factory: Mock Company
 */
export function mockCompany(overrides: Record<string, unknown> = {}) {
  return {
    _id: '507f1f77bcf86cd799439011',
    companyCode: 'ESP001',
    businessName: 'Empresa Test',
    cuitCuil: '30123456789',
    address: 'Calle Test 123',
    contactInfo: {
      name: 'Juan Test',
      phone: '1234567890',
      email: 'test@empresa.com',
    },
    isActive: true,
    subscriptionEndDate: '2027-12-31T23:59:59Z',
    maxUsers: 50,
    maxClients: 1000,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Factory: Mock User
 */
export function mockUser(overrides: Record<string, unknown> = {}) {
  return {
    _id: '507f1f77bcf86cd799439012',
    companyId: '507f1f77bcf86cd799439011',
    username: 'admin.test',
    name: 'Admin Test',
    dni: '12345678',
    role: 'admin',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    ...overrides,
  };
}

/**
 * Factory: Mock Transaction
 */
export function mockTransaction(
  type: 'EARN' | 'REDEEM' = 'EARN',
  overrides: Record<string, unknown> = {}
) {
  const base = {
    _id: 'tx-' + Math.random().toString(36).slice(2, 8),
    companyId: '507f1f77bcf86cd799439011',
    type,
    dni: '33333333',
    clientId: 'client1',
    points: type === 'EARN' ? 10 : 50,
    userId: 'user1',
    createdAt: '2026-02-01T10:00:00Z',
  };

  if (type === 'EARN') {
    return {
      ...base,
      saleCode: 'SALE-' + Math.random().toString(36).slice(2, 6).toUpperCase(),
      productName: 'Café Espresso',
      ...overrides,
    };
  }

  return {
    ...base,
    rewardId: 'reward1',
    rewardName: 'Café Gratis',
    ...overrides,
  };
}

/**
 * Factory: Mock paginated response
 */
export function mockPaginatedResponse<T>(
  data: T[],
  overrides: { total?: number; page?: number; limit?: number } = {}
) {
  const total = overrides.total ?? data.length;
  const limit = overrides.limit ?? 20;
  const page = overrides.page ?? 1;

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}
