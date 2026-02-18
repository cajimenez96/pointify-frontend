/**
 * Hook for updating a user with TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateUser } from '@/repositories/superadmin/users/users';
import type { UpdateUserDto } from '@/repositories/superadmin/users/types';

interface UpdateUserParams {
  id: string;
  dto: UpdateUserDto;
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: UpdateUserParams) => updateUser(id, dto),
    onSuccess: () => {
      // Invalidate users query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar usuario');
    },
  });
}
