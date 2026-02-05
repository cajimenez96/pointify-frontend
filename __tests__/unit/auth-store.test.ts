import { useAuthStore } from '@/lib/auth-store';
import apiClient from '@/lib/api-client';
import { mockLoginSuccess, mockLoginError } from '../utils/mock-api';

// Mock del API client
jest.mock('@/lib/api-client');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('AuthStore', () => {
  beforeEach(() => {
    // Reset store state
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isLoading: false,
    });
    
    // Clear mocks
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Initial state', () => {
    it('should initialize with null user and token', () => {
      const { user, accessToken, isLoading } = useAuthStore.getState();
      
      expect(user).toBeNull();
      expect(accessToken).toBeNull();
      expect(isLoading).toBe(false);
    });
  });

  describe('loginSuperAdmin', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = mockLoginSuccess('superadmin');
      mockedApiClient.post.mockResolvedValue(mockResponse);

      const { loginSuperAdmin } = useAuthStore.getState();
      await loginSuperAdmin('superadmin', 'password123');

      const { user, accessToken } = useAuthStore.getState();
      
      expect(user).not.toBeNull();
      expect(user?.username).toBe('superadmin');
      expect(user?.isSuperAdmin).toBe(true);
      expect(user?.role).toBe('superadmin');
      expect(accessToken).toBe('mock-jwt-token');
      
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/superadmin/login', {
        username: 'superadmin',
        password: 'password123',
      });
    });

    it('should throw error with invalid credentials', async () => {
      mockedApiClient.post.mockRejectedValue(mockLoginError('Credenciales inválidas'));

      const { loginSuperAdmin } = useAuthStore.getState();
      
      await expect(
        loginSuperAdmin('invalid', 'wrong')
      ).rejects.toMatchObject({
        response: {
          status: 401,
          data: {
            message: 'Credenciales inválidas',
          },
        },
      });

      const { user, accessToken } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(accessToken).toBeNull();
    });
  });

  describe('loginTenant', () => {
    it('should login admin successfully with valid credentials', async () => {
      const mockResponse = mockLoginSuccess('admin');
      mockedApiClient.post.mockResolvedValue(mockResponse);

      const { loginTenant } = useAuthStore.getState();
      await loginTenant('DEFAULT', 'admin', 'password123');

      const { user, accessToken } = useAuthStore.getState();
      
      expect(user).not.toBeNull();
      expect(user?.username).toBe('admin');
      expect(user?.role).toBe('admin');
      expect(user?.companyCode).toBe('DEFAULT');
      expect(user?.companyName).toBe('Empresa Demo');
      expect(user?.isSuperAdmin).toBe(false);
      expect(accessToken).toBe('mock-jwt-token');
      
      expect(mockedApiClient.post).toHaveBeenCalledWith('/auth/login', {
        companyCode: 'DEFAULT',
        username: 'admin',
        password: 'password123',
      });
    });

    it('should login cashier successfully with valid credentials', async () => {
      const mockResponse = mockLoginSuccess('cashier');
      mockedApiClient.post.mockResolvedValue(mockResponse);

      const { loginTenant } = useAuthStore.getState();
      await loginTenant('DEFAULT', 'cashier', 'password123');

      const { user } = useAuthStore.getState();
      
      expect(user).not.toBeNull();
      expect(user?.role).toBe('cashier');
      expect(user?.companyCode).toBe('DEFAULT');
    });

    it('should throw error with invalid company code', async () => {
      mockedApiClient.post.mockRejectedValue(mockLoginError('Empresa no encontrada'));

      const { loginTenant } = useAuthStore.getState();
      
      await expect(
        loginTenant('INVALID', 'admin', 'password123')
      ).rejects.toMatchObject({
        response: {
          data: {
            message: 'Empresa no encontrada',
          },
        },
      });
    });
  });

  describe('logout', () => {
    it('should clear user and token from state', () => {
      // Setup: Login first
      useAuthStore.setState({
        user: mockLoginSuccess('admin').data.user,
        accessToken: 'mock-jwt-token',
      });

      const { logout } = useAuthStore.getState();
      logout();

      const { user, accessToken } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(accessToken).toBeNull();
    });

    it('should clear user and token from localStorage state', () => {
      // Setup: Set some data in localStorage
      localStorage.setItem('pointify-auth-storage', JSON.stringify({
        state: {
          user: mockLoginSuccess('admin').data.user,
          accessToken: 'mock-jwt-token',
        },
        version: 0,
      }));

      const { logout } = useAuthStore.getState();
      logout();

      const storage = localStorage.getItem('pointify-auth-storage');
      
      // Zustand persist mantiene el objeto pero con valores null
      expect(storage).not.toBeNull();
      const { state } = JSON.parse(storage!);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
    });
  });

  describe('localStorage persistence', () => {
    it('should persist user and token to localStorage after login', async () => {
      const mockResponse = mockLoginSuccess('superadmin');
      mockedApiClient.post.mockResolvedValue(mockResponse);

      const { loginSuperAdmin } = useAuthStore.getState();
      await loginSuperAdmin('superadmin', 'password123');

      const storage = localStorage.getItem('pointify-auth-storage');
      expect(storage).not.toBeNull();
      
      const { state } = JSON.parse(storage!);
      expect(state.user).toMatchObject({
        username: 'superadmin',
        isSuperAdmin: true,
      });
      expect(state.accessToken).toBe('mock-jwt-token');
    });

    it('should recover session from localStorage on init', () => {
      // Setup: Simular sesión guardada
      const mockUser = mockLoginSuccess('admin').data.user;
      localStorage.setItem('pointify-auth-storage', JSON.stringify({
        state: {
          user: mockUser,
          accessToken: 'saved-token',
          isLoading: false,
        },
        version: 0,
      }));

      // Reset store y forzar recuperación
      useAuthStore.persist.rehydrate();

      const { user, accessToken } = useAuthStore.getState();
      expect(user).toMatchObject({
        username: 'admin',
        role: 'admin',
      });
      expect(accessToken).toBe('saved-token');
    });
  });
});
