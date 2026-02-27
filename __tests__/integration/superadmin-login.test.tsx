/**
 * Integration test: SuperAdmin Login Flow
 * Tests form submission, validation, success redirect, and error states
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SuperAdminLoginPage from '@/app/superadmin/login/page';
import { useAuthStore } from '@/lib/auth-store';
import { AuthError } from '@/repositories/auth/types';

// Mock dependencies
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/superadmin/login',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock the auth repository
const mockLoginSuperAdmin = jest.fn();
jest.mock('@/repositories/auth/auth', () => ({
  loginSuperAdmin: (...args: unknown[]) => mockLoginSuperAdmin(...args),
}));

import { toast } from 'sonner';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: { retry: false },
      queries: { retry: false },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe('SuperAdmin Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoginSuperAdmin.mockReset();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should render login form with all fields', () => {
    render(<SuperAdminLoginPage />, { wrapper: createWrapper() });

    expect(screen.getByText('Pointify')).toBeInTheDocument();
    expect(screen.getByText('Panel de SuperAdmin')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<SuperAdminLoginPage />, { wrapper: createWrapper() });

    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(
        screen.getByText('El usuario debe tener al menos 3 caracteres')
      ).toBeInTheDocument();
      expect(
        screen.getByText('La contraseña debe tener al menos 6 caracteres')
      ).toBeInTheDocument();
    });
  });

  it('should show validation error for short username', async () => {
    const user = userEvent.setup();
    render(<SuperAdminLoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('Usuario'), 'ab');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(
        screen.getByText('El usuario debe tener al menos 3 caracteres')
      ).toBeInTheDocument();
    });
  });

  it('should call repository loginSuperAdmin and redirect on success', async () => {
    mockLoginSuperAdmin.mockResolvedValue({
      access_token: 'jwt-token',
      user: {
        id: 'user-1',
        username: 'superadmin',
        name: 'Super Admin',
        role: 'superadmin',
        isSuperAdmin: true,
      },
    });

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('Usuario'), 'superadmin');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(mockLoginSuperAdmin).toHaveBeenCalledWith({
        username: 'superadmin',
        password: 'admin123',
      });
      expect(toast.success).toHaveBeenCalledWith('Bienvenido, SuperAdmin');
      expect(mockPush).toHaveBeenCalledWith('/superadmin/dashboard');
    });

    // Verify auth store was updated
    const { user: storedUser, accessToken } = useAuthStore.getState();
    expect(storedUser?.username).toBe('superadmin');
    expect(storedUser?.isSuperAdmin).toBe(true);
    expect(accessToken).toBe('jwt-token');
  });

  it('should show error toast on failed login', async () => {
    mockLoginSuperAdmin.mockRejectedValue(
      new AuthError('Credenciales inválidas', 401)
    );

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('Usuario'), 'superadmin');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciales inválidas');
    });
  });

  it('should show default error message when error has no message', async () => {
    mockLoginSuperAdmin.mockRejectedValue(new Error());

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('Usuario'), 'superadmin');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Credenciales inválidas. Verifica tu usuario y contraseña.'
      );
    });
  });

  it('should disable form during submission', async () => {
    let resolveLogin: (value: unknown) => void;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    mockLoginSuperAdmin.mockReturnValue(loginPromise);

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />, { wrapper: createWrapper() });

    await user.type(screen.getByPlaceholderText('Usuario'), 'superadmin');
    await user.type(screen.getByPlaceholderText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Usuario')).toBeDisabled();
      expect(screen.getByPlaceholderText('Contraseña')).toBeDisabled();
    });

    // Resolve the login promise
    resolveLogin!({
      access_token: 'jwt-token',
      user: {
        id: 'user-1',
        username: 'superadmin',
        name: 'Super Admin',
        role: 'superadmin',
        isSuperAdmin: true,
      },
    });
  });
});
