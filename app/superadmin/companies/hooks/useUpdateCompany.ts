/**
 * Hook for updating an existing company
 */

import { useState } from 'react';
import { updateCompany } from '@/repositories/superadmin/companies/companies';
import { CompanyError } from '@/repositories/superadmin/companies/types';
import type {
  UpdateCompanyDto,
  CompanyResponse,
} from '@/repositories/superadmin/companies/types';

interface UseUpdateCompanyReturn {
  updateCompanyMutation: (
    id: string,
    dto: UpdateCompanyDto
  ) => Promise<CompanyResponse>;
  isUpdating: boolean;
  error: string | null;
  updatedCompany: CompanyResponse | null;
  reset: () => void;
}

export function useUpdateCompany(): UseUpdateCompanyReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedCompany, setUpdatedCompany] = useState<CompanyResponse | null>(
    null
  );

  const updateCompanyMutation = async (
    id: string,
    dto: UpdateCompanyDto
  ): Promise<CompanyResponse> => {
    setIsUpdating(true);
    setError(null);

    try {
      const company = await updateCompany(id, dto);
      setUpdatedCompany(company);
      return company;
    } catch (err) {
      const errorMessage =
        err instanceof CompanyError
          ? err.message
          : 'Error al actualizar empresa';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const reset = () => {
    setError(null);
    setUpdatedCompany(null);
  };

  return {
    updateCompanyMutation,
    isUpdating,
    error,
    updatedCompany,
    reset,
  };
}
