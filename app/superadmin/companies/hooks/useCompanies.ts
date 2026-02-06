/**
 * Hook for fetching and managing companies list with pagination
 */

import { useState, useEffect, useCallback } from 'react';
import { getCompanies } from '@/repositories/superadmin/companies/companies';
import type {
  Company,
  QueryCompaniesDto,
  PaginationMeta,
} from '@/repositories/superadmin/companies/types';
import { CompanyError } from '@/repositories/superadmin/companies/types';

interface UseCompaniesReturn {
  companies: Company[];
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setQuery: (query: QueryCompaniesDto) => void;
}

export function useCompanies(
  initialQuery: QueryCompaniesDto = {}
): UseCompaniesReturn {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<QueryCompaniesDto>(initialQuery);

  const fetchCompanies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCompanies(query);
      setCompanies(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof CompanyError
          ? err.message
          : 'Error al cargar empresas';
      setError(errorMessage);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    pagination,
    isLoading,
    error,
    refetch: fetchCompanies,
    setQuery,
  };
}
