import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos de usuario
export interface User {
  id: string;
  username: string;
  name: string;
  role: 'superadmin' | 'admin' | 'cashier';
  isSuperAdmin?: boolean;
  companyCode?: string;
  companyName?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  logout: () => void;
  initializeAuth: () => void;
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

      // Establecer autenticación (llamado por hooks de login)
      setAuth: (user: User, accessToken: string) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
        });
      },

      // Limpiar autenticación
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      // Logout
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });

        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
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
