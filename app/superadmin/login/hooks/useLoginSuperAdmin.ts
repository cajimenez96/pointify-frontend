/**
 * Hook for SuperAdmin login with TanStack Query
 */

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { loginSuperAdmin } from '@/repositories/auth/auth';
import { useAuthStore } from '@/lib/auth-store';
import type { SuperAdminLoginDto, LoginResponse } from '@/repositories/auth/types';
import type { User } from '@/lib/auth-store';

export function useLoginSuperAdminMutation() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (dto: SuperAdminLoginDto) => loginSuperAdmin(dto),
    onSuccess: (data: LoginResponse) => {
      const user: User = {
        id: data.user.id,
        username: data.user.username,
        name: data.user.name,
        role: 'superadmin',
        isSuperAdmin: true,
      };
      setAuth(user, data.access_token);
      toast.success('Bienvenido, SuperAdmin');
      router.push('/superadmin/dashboard');
    },
    onError: (error: Error) => {
      toast.error(
        error.message || 'Credenciales inválidas. Verifica tu usuario y contraseña.'
      );
    },
  });
}
