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
