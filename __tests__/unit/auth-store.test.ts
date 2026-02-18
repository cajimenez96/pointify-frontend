import { useAuthStore } from '@/lib/auth-store';
import { mockLoginSuccess } from '../utils/mock-api';

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
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

  describe('setAuth', () => {
    it('should set user and token for superadmin', () => {
      const mockResponse = mockLoginSuccess('superadmin');
      const mockUser = {
        id: mockResponse.data.user.id,
        username: mockResponse.data.user.username,
        name: mockResponse.data.user.name,
        role: 'superadmin' as const,
        isSuperAdmin: true,
      };

      const { setAuth } = useAuthStore.getState();
      setAuth(mockUser, mockResponse.data.access_token);

      const { user, accessToken, isAuthenticated } = useAuthStore.getState();

      expect(user).not.toBeNull();
      expect(user?.username).toBe('superadmin');
      expect(user?.isSuperAdmin).toBe(true);
      expect(user?.role).toBe('superadmin');
      expect(accessToken).toBe('mock-jwt-token');
      expect(isAuthenticated).toBe(true);
    });

    it('should set user and token for admin', () => {
      const mockResponse = mockLoginSuccess('admin');
      const mockUser = {
        id: mockResponse.data.user.id,
        username: mockResponse.data.user.username,
        name: mockResponse.data.user.name,
        role: 'admin' as const,
        companyCode: 'DEFAULT',
        companyName: 'Empresa Demo',
        isSuperAdmin: false,
      };

      const { setAuth } = useAuthStore.getState();
      setAuth(mockUser, mockResponse.data.access_token);

      const { user, accessToken, isAuthenticated } = useAuthStore.getState();

      expect(user).not.toBeNull();
      expect(user?.username).toBe('admin');
      expect(user?.role).toBe('admin');
      expect(user?.companyCode).toBe('DEFAULT');
      expect(user?.companyName).toBe('Empresa Demo');
      expect(user?.isSuperAdmin).toBe(false);
      expect(accessToken).toBe('mock-jwt-token');
      expect(isAuthenticated).toBe(true);
    });

    it('should set user and token for cashier', () => {
      const mockUser = {
        id: 'cashier-id',
        username: 'cajero1',
        name: 'Cajero Uno',
        role: 'cashier' as const,
        companyCode: 'DEFAULT',
        companyName: 'Empresa Demo',
        isSuperAdmin: false,
      };

      const { setAuth } = useAuthStore.getState();
      setAuth(mockUser, 'cashier-token');

      const { user } = useAuthStore.getState();
      expect(user?.role).toBe('cashier');
      expect(user?.companyCode).toBe('DEFAULT');
    });
  });

  describe('clearAuth', () => {
    it('should clear user and token from state', () => {
      // Setup: set auth first
      useAuthStore.setState({
        user: {
          id: 'test-id',
          username: 'admin',
          name: 'Admin',
          role: 'admin',
        },
        accessToken: 'mock-jwt-token',
        isAuthenticated: true,
      });

      const { clearAuth } = useAuthStore.getState();
      clearAuth();

      const { user, accessToken, isAuthenticated } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(accessToken).toBeNull();
      expect(isAuthenticated).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear user and token from state', () => {
      useAuthStore.setState({
        user: mockLoginSuccess('admin').data.user as any,
        accessToken: 'mock-jwt-token',
        isAuthenticated: true,
      });

      const { logout } = useAuthStore.getState();
      logout();

      const { user, accessToken, isAuthenticated } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(accessToken).toBeNull();
      expect(isAuthenticated).toBe(false);
    });

    it('should clear user and token from localStorage state', () => {
      localStorage.setItem(
        'pointify-auth-storage',
        JSON.stringify({
          state: {
            user: mockLoginSuccess('admin').data.user,
            accessToken: 'mock-jwt-token',
          },
          version: 0,
        })
      );

      const { logout } = useAuthStore.getState();
      logout();

      const storage = localStorage.getItem('pointify-auth-storage');
      expect(storage).not.toBeNull();
      const { state } = JSON.parse(storage!);
      expect(state.user).toBeNull();
      expect(state.accessToken).toBeNull();
    });
  });

  describe('initializeAuth', () => {
    it('should set isAuthenticated true if user and token exist', () => {
      useAuthStore.setState({
        user: {
          id: 'test-id',
          username: 'admin',
          name: 'Admin',
          role: 'admin',
        },
        accessToken: 'saved-token',
        isLoading: true,
      });

      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();

      const { isAuthenticated, isLoading } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
      expect(isLoading).toBe(false);
    });

    it('should set isAuthenticated false if no user', () => {
      useAuthStore.setState({
        user: null,
        accessToken: null,
        isLoading: true,
      });

      const { initializeAuth } = useAuthStore.getState();
      initializeAuth();

      const { isAuthenticated, isLoading } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
      expect(isLoading).toBe(false);
    });
  });

  describe('localStorage persistence', () => {
    it('should persist user and token after setAuth', () => {
      const mockUser = {
        id: 'test-id',
        username: 'superadmin',
        name: 'Super Admin',
        role: 'superadmin' as const,
        isSuperAdmin: true,
      };

      const { setAuth } = useAuthStore.getState();
      setAuth(mockUser, 'mock-jwt-token');

      const storage = localStorage.getItem('pointify-auth-storage');
      expect(storage).not.toBeNull();

      const { state } = JSON.parse(storage!);
      expect(state.user).toMatchObject({
        username: 'superadmin',
        isSuperAdmin: true,
      });
      expect(state.accessToken).toBe('mock-jwt-token');
    });

    it('should recover session from localStorage on rehydrate', () => {
      const mockUser = mockLoginSuccess('admin').data.user;
      localStorage.setItem(
        'pointify-auth-storage',
        JSON.stringify({
          state: {
            user: mockUser,
            accessToken: 'saved-token',
            isLoading: false,
          },
          version: 0,
        })
      );

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
