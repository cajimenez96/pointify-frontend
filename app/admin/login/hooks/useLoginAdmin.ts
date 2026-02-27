/**
 * Hook for Admin/Tenant login with TanStack Query
 */

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginTenant } from '@/repositories/auth/auth';
import { useAuthStore } from '@/lib/auth-store';
import type { TenantLoginDto, LoginResponse } from '@/repositories/auth/types';
import type { User } from '@/lib/auth-store';

export function useLoginAdminMutation() {
  const router = useRouter();
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
      toast.success('¡Bienvenido!');
      router.push('/admin/dashboard');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Credenciales inválidas. Verifica los datos ingresados.'
      );
    },
  });
}
