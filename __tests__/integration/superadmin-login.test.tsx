/**
 * Integration test: SuperAdmin Login Flow
 * Tests form submission, validation, success redirect, and error states
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SuperAdminLoginPage from '@/app/superadmin/login/page';
import { useAuthStore } from '@/lib/auth-store';

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
  },
}));

import { toast } from 'sonner';

describe('SuperAdmin Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it('should render login form with all fields', () => {
    render(<SuperAdminLoginPage />);

    expect(screen.getByText('Pointify')).toBeInTheDocument();
    expect(screen.getByText('Panel de SuperAdmin')).toBeInTheDocument();
    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Iniciar Sesión' })
    ).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    render(<SuperAdminLoginPage />);

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
    render(<SuperAdminLoginPage />);

    await user.type(screen.getByLabelText('Usuario'), 'ab');
    await user.type(screen.getByLabelText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(
        screen.getByText('El usuario debe tener al menos 3 caracteres')
      ).toBeInTheDocument();
    });
  });

  it('should call loginSuperAdmin and redirect on success', async () => {
    // Mock successful login
    const mockLoginSuperAdmin = jest.fn().mockResolvedValue(undefined);
    useAuthStore.setState({
      loginSuperAdmin: mockLoginSuperAdmin,
    } as any);

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />);

    await user.type(screen.getByLabelText('Usuario'), 'superadmin');
    await user.type(screen.getByLabelText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(mockLoginSuperAdmin).toHaveBeenCalledWith(
        'superadmin',
        'admin123'
      );
      expect(toast.success).toHaveBeenCalledWith('Bienvenido, SuperAdmin');
      expect(mockPush).toHaveBeenCalledWith('/superadmin/dashboard');
    });
  });

  it('should show error toast on failed login', async () => {
    const mockLoginSuperAdmin = jest.fn().mockRejectedValue({
      response: {
        data: { message: 'Credenciales inválidas' },
      },
    });
    useAuthStore.setState({
      loginSuperAdmin: mockLoginSuperAdmin,
    } as any);

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />);

    await user.type(screen.getByLabelText('Usuario'), 'superadmin');
    await user.type(screen.getByLabelText('Contraseña'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Credenciales inválidas');
    });
  });

  it('should show default error message when no API message', async () => {
    const mockLoginSuperAdmin = jest.fn().mockRejectedValue(new Error());
    useAuthStore.setState({
      loginSuperAdmin: mockLoginSuperAdmin,
    } as any);

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />);

    await user.type(screen.getByLabelText('Usuario'), 'superadmin');
    await user.type(screen.getByLabelText('Contraseña'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Credenciales inválidas. Verifica tu usuario y contraseña.'
      );
    });
  });

  it('should disable form during submission', async () => {
    let resolveLogin: () => void;
    const loginPromise = new Promise<void>((resolve) => {
      resolveLogin = resolve;
    });
    const mockLoginSuperAdmin = jest.fn().mockReturnValue(loginPromise);
    useAuthStore.setState({
      loginSuperAdmin: mockLoginSuperAdmin,
    } as any);

    const user = userEvent.setup();
    render(<SuperAdminLoginPage />);

    await user.type(screen.getByLabelText('Usuario'), 'superadmin');
    await user.type(screen.getByLabelText('Contraseña'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }));

    await waitFor(() => {
      expect(screen.getByText('Iniciando sesión...')).toBeInTheDocument();
      expect(screen.getByLabelText('Usuario')).toBeDisabled();
      expect(screen.getByLabelText('Contraseña')).toBeDisabled();
    });

    // Resolve the login promise
    resolveLogin!();
  });
});
