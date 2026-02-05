import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from './api-client';

// Tipos de usuario
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin' | 'cashier';
  isSuperAdmin?: boolean;
  companyCode?: string;
  companyName?: string;
  dni?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  // Login SuperAdmin
  loginSuperAdmin: (username: string, password: string) => Promise<void>;
  
  // Login Tenant (Admin/Cajero)
  loginTenant: (companyCode: string, username: string, password: string) => Promise<void>;
  
  // Logout
  logout: () => void;
  
  // Inicializar autenticación desde localStorage
  initializeAuth: () => void;
  
  // Setters internos
  setAuth: (user: User, accessToken: string) => void;
  clearAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      // Inicializar autenticación (se llama al cargar la app)
      initializeAuth: () => {
        const state = get();
        
        if (state.user && state.accessToken) {
          set({ isAuthenticated: true, isLoading: false });
        } else {
          set({ isAuthenticated: false, isLoading: false });
        }
      },

      // Login SuperAdmin
      loginSuperAdmin: async (username: string, password: string) => {
        try {
          const response = await apiClient.post('/auth/superadmin/login', {
            username,
            password,
          });

          const { access_token, user } = response.data;

          set({
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              role: 'superadmin',
              isSuperAdmin: true,
            },
            accessToken: access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('[AuthStore] Error en loginSuperAdmin:', error);
          throw error;
        }
      },

      // Login Tenant (Admin/Cajero)
      loginTenant: async (companyCode: string, username: string, password: string) => {
        try {
          const response = await apiClient.post('/auth/login', {
            companyCode,
            username,
            password,
          });

          const { access_token, user } = response.data;

          set({
            user: {
              id: user.id,
              username: user.username,
              name: user.name,
              role: user.role as 'admin' | 'cashier',
              companyCode: user.companyCode,
              companyName: user.companyName,
              dni: user.dni,
              isSuperAdmin: false,
            },
            accessToken: access_token,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('[AuthStore] Error en loginTenant:', error);
          throw error;
        }
      },

      // Logout
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });

        // Redirigir a login
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },

      // Setters internos (para uso futuro si es necesario)
      setAuth: (user: User, accessToken: string) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'pointify-auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);
