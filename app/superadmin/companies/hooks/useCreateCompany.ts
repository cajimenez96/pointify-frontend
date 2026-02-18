/**
 * Hook for creating a new company with TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createCompany } from '@/repositories/superadmin/companies/companies';
import type { CreateCompanyDto } from '@/repositories/superadmin/companies/types';

export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateCompanyDto) => createCompany(dto),
    onSuccess: () => {
      // Invalidate companies query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al crear empresa');
    },
  });
}
