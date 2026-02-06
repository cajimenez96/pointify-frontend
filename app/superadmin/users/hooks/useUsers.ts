/**
 * Hook for fetching and managing users list with filters
 */

import { useState, useEffect } from "react";
import { getUsers } from "@/repositories/superadmin/users/users";
import { UserError } from "@/repositories/superadmin/users/types";
import type {
  UserResponse,
  QueryUsersDto,
  Pagination,
} from "@/repositories/superadmin/users/types";

interface UseUsersReturn {
  users: UserResponse[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  setFilters: (filters: Partial<QueryUsersDto>) => void;
  setPage: (page: number) => void;
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<QueryUsersDto>({
    page: 1,
    limit: 20,
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUsers(filters);
      setUsers(response.data);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage =
        err instanceof UserError
          ? err.message
          : "Error al cargar usuarios";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const setFilters = (newFilters: Partial<QueryUsersDto>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1, // Reset to page 1 when filters change
    }));
  };

  const setPage = (page: number) => {
    setFiltersState((prev) => ({ ...prev, page }));
  };

  return {
    users,
    pagination,
    isLoading,
    error,
    refetch: fetchUsers,
    setFilters,
    setPage,
  };
}
