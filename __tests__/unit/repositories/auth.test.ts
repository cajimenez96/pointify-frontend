/**
 * Unit tests for Auth Repository
 * Tests API calls and error handling for login operations
 */

import {
  loginSuperAdmin,
  loginTenant,
} from '@/repositories/auth/auth';
import { AuthError } from '@/repositories/auth/types';
import type {
  SuperAdminLoginDto,
  TenantLoginDto,
  LoginResponse,
} from '@/repositories/auth/types';

// Mock apiClient (default export)
jest.mock('@/lib/api-client', () => {
  const mock = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    __esModule: true,
    default: mock,
    apiClient: mock,
  };
});

import apiClient from '@/lib/api-client';

const mockPost = apiClient.post as jest.Mock;

describe('Auth Repository', () => {
  const mockSuperAdminResponse: LoginResponse = {
    access_token: 'jwt-token-superadmin',
    user: {
      id: '507f1f77bcf86cd799439011',
      username: 'superadmin',
      name: 'Super Admin',
      role: 'superadmin',
      isSuperAdmin: true,
    },
  };

  const mockTenantResponse: LoginResponse = {
    access_token: 'jwt-token-tenant',
    user: {
      id: '507f1f77bcf86cd799439022',
      username: 'admin1',
      name: 'Admin User',
      role: 'admin',
      companyCode: 'ESP001',
      companyName: 'Empresa Test',
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loginSuperAdmin', () => {
    const dto: SuperAdminLoginDto = {
      username: 'superadmin',
      password: 'admin123',
    };

    it('should call POST /auth/superadmin/login and return LoginResponse', async () => {
      mockPost.mockResolvedValue({ data: mockSuperAdminResponse });

      const result = await loginSuperAdmin(dto);

      expect(mockPost).toHaveBeenCalledWith('/auth/superadmin/login', dto);
      expect(result).toEqual(mockSuperAdminResponse);
      expect(result.access_token).toBe('jwt-token-superadmin');
      expect(result.user.isSuperAdmin).toBe(true);
    });

    it('should throw AuthError on 401 invalid credentials', async () => {
      const axiosError = new Error('Unauthorized') as any;
      axiosError.response = {
        status: 401,
        data: {
          statusCode: 401,
          message: 'Credenciales inválidas',
          error: 'Unauthorized',
        },
      };

      mockPost.mockRejectedValue(axiosError);

      try {
        await loginSuperAdmin(dto);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).message).toBe('Credenciales inválidas');
        expect((error as AuthError).statusCode).toBe(401);
      }
    });

    it('should throw AuthError on network error', async () => {
      mockPost.mockRejectedValue(new Error('Network Error'));

      try {
        await loginSuperAdmin(dto);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).message).toBe('Network Error');
        expect((error as AuthError).statusCode).toBe(500);
      }
    });
  });

  describe('loginTenant', () => {
    const dto: TenantLoginDto = {
      companyCode: 'ESP001',
      username: 'admin1',
      password: 'admin123',
    };

    it('should call POST /auth/login and return LoginResponse', async () => {
      mockPost.mockResolvedValue({ data: mockTenantResponse });

      const result = await loginTenant(dto);

      expect(mockPost).toHaveBeenCalledWith('/auth/login', dto);
      expect(result).toEqual(mockTenantResponse);
      expect(result.user.companyCode).toBe('ESP001');
      expect(result.user.companyName).toBe('Empresa Test');
    });

    it('should throw AuthError on 401 invalid company code', async () => {
      const axiosError = new Error('Unauthorized') as any;
      axiosError.response = {
        status: 401,
        data: {
          statusCode: 401,
          message: 'Código de empresa inválido',
          error: 'Unauthorized',
        },
      };

      mockPost.mockRejectedValue(axiosError);

      try {
        await loginTenant(dto);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).message).toBe('Código de empresa inválido');
        expect((error as AuthError).statusCode).toBe(401);
      }
    });

    it('should join array messages with comma', async () => {
      const axiosError = new Error('Bad Request') as any;
      axiosError.response = {
        status: 400,
        data: {
          statusCode: 400,
          message: ['username must be longer', 'password must be longer'],
          error: 'Bad Request',
        },
      };

      mockPost.mockRejectedValue(axiosError);

      try {
        await loginTenant(dto);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(AuthError);
        expect((error as AuthError).message).toBe(
          'username must be longer, password must be longer'
        );
        expect((error as AuthError).statusCode).toBe(400);
      }
    });
  });
});
