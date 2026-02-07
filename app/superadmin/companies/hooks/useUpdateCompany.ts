/**
 * Hook for updating a company with TanStack Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { updateCompany } from '@/repositories/superadmin/companies/companies';
import type { UpdateCompanyDto } from '@/repositories/superadmin/companies/types';

interface UpdateCompanyParams {
  id: string;
  dto: UpdateCompanyDto;
}

export function useUpdateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: UpdateCompanyParams) => updateCompany(id, dto),
    onSuccess: () => {
      // Invalidate companies query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Empresa actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al actualizar empresa');
    },
  });
}
