import { create } from 'zustand';
import apiClient from './api-client';

interface User {
  userId: string;
  dni: string;
  role: 'admin' | 'cashier';
  name?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (dni: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isLoading: false });
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          set({ user: null, token: null, isLoading: false });
        }
      } else {
        set({ isLoading: false });
      }
    }
  },

  login: async (dni: string, password: string) => {
    const res = await apiClient.post('/auth/login', {
      dni,
      password,
    });
    
    const { access_token, user } = res.data;
    
    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));
    
    set({ user, token: access_token });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null });
  },
}));
