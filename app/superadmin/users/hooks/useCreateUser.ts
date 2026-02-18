/**
 * Hook for creating a new user with TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createUser } from '@/repositories/superadmin/users/users';
import type { CreateUserBySuperAdminDto } from '@/repositories/superadmin/users/types';

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateUserBySuperAdminDto) => createUser(dto),
    onSuccess: () => {
      // Invalidate users query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear usuario');
    },
  });
}
