/**
 * useClientRegister Hook
 * Handles profile completion for pending (shadow) users
 * Uses completeProfile() from clients repository + TanStack Query useMutation
 */

import { useMutation } from '@tanstack/react-query';
import { completeProfile } from '@/repositories/clients/clients';
import { toast } from 'sonner';

export function useClientRegister() {
  return useMutation({
    mutationFn: completeProfile,
    onSuccess: () => {
      toast.success('¡Registro completado! Bienvenido a Pointify.');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al registrar cliente');
    },
  });
}
