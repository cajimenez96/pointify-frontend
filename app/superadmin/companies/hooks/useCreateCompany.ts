/**
 * Hook for creating a new company
 */

import { useState } from 'react';
import { createCompany } from '@/repositories/superadmin/companies/companies';
import { CompanyError } from '@/repositories/superadmin/companies/types';
import type {
  CreateCompanyDto,
  CompanyResponse,
} from '@/repositories/superadmin/companies/types';

interface UseCreateCompanyReturn {
  createCompanyMutation: (dto: CreateCompanyDto) => Promise<CompanyResponse>;
  isCreating: boolean;
  error: string | null;
  createdCompany: CompanyResponse | null;
  reset: () => void;
}

export function useCreateCompany(): UseCreateCompanyReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCompany, setCreatedCompany] = useState<CompanyResponse | null>(
    null
  );

  const createCompanyMutation = async (
    dto: CreateCompanyDto
  ): Promise<CompanyResponse> => {
    setIsCreating(true);
    setError(null);

    try {
      const company = await createCompany(dto);
      setCreatedCompany(company);
      return company;
    } catch (err) {
      const errorMessage =
        err instanceof CompanyError ? err.message : 'Error al crear empresa';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const reset = () => {
    setError(null);
    setCreatedCompany(null);
  };

  return {
    createCompanyMutation,
    isCreating,
    error,
    createdCompany,
    reset,
  };
}
