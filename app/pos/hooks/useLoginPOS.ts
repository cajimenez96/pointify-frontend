/**
 * Hook for POS login with TanStack Query
 * Unlike admin/superadmin, this does NOT redirect after login.
 * The POS page re-renders inline to show the authenticated view.
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { loginTenant } from '@/repositories/auth/auth';
import { useAuthStore } from '@/lib/auth-store';
import type { TenantLoginDto, LoginResponse } from '@/repositories/auth/types';
import type { User } from '@/lib/auth-store';

export function useLoginPOSMutation() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (dto: TenantLoginDto) => loginTenant(dto),
    onSuccess: (data: LoginResponse) => {
      const user: User = {
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        role: data.user.role as 'admin' | 'cashier',
        companyCode: data.user.companyCode,
        companyName: data.user.companyName,
        isSuperAdmin: false,
      };
      setAuth(user, data.access_token);
      toast.success('Sesión iniciada correctamente');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Error al iniciar sesión. Verifica tus credenciales.'
      );
    },
  });
}
