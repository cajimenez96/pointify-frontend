/**
 * Hook for creating a new user
 */

import { useState } from "react";
import { createUser } from "@/repositories/superadmin/users/users";
import { UserError } from "@/repositories/superadmin/users/types";
import type {
  CreateUserBySuperAdminDto,
  UserResponse,
} from "@/repositories/superadmin/users/types";

interface UseCreateUserReturn {
  createUserMutation: (
    dto: CreateUserBySuperAdminDto
  ) => Promise<UserResponse>;
  isCreating: boolean;
  error: string | null;
  createdUser: UserResponse | null;
  reset: () => void;
}

export function useCreateUser(): UseCreateUserReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdUser, setCreatedUser] = useState<UserResponse | null>(null);

  const createUserMutation = async (
    dto: CreateUserBySuperAdminDto
  ): Promise<UserResponse> => {
    setIsCreating(true);
    setError(null);

    try {
      const user = await createUser(dto);
      setCreatedUser(user);
      return user;
    } catch (err) {
      const errorMessage =
        err instanceof UserError ? err.message : "Error al crear usuario";
      setError(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  const reset = () => {
    setError(null);
    setCreatedUser(null);
  };

  return {
    createUserMutation,
    isCreating,
    error,
    createdUser,
    reset,
  };
}
