/**
 * SuperAdmin Users Repository
 * API interactions for user management
 */

import apiClient from "@/lib/api-client";
import type {
  CreateUserBySuperAdminDto,
  QueryUsersDto,
  UserResponse,
  GetUsersResponse,
  UserError,
} from "./types";

/**
 * Create a new user (admin or cashier) for a specific company
 * @throws UserError
 */
export async function createUser(
  dto: CreateUserBySuperAdminDto
): Promise<UserResponse> {
  try {
    const response = await apiClient.post<UserResponse>(
      "/superadmin/users",
      dto
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status: number; data?: { message?: string } };
      };
      const status = axiosError.response?.status;
      const message = axiosError.response?.data?.message;

      if (status === 400) {
        throw new (UserError as any)(
          message || "Datos de usuario inválidos",
          400
        );
      }
      if (status === 404) {
        throw new (UserError as any)(
          message || "Empresa no encontrada",
          404
        );
      }
      if (status === 409) {
        throw new (UserError as any)(
          message || "Username o DNI ya existe en esta empresa",
          409
        );
      }
    }
    throw new (UserError as any)(
      "Error al crear usuario. Por favor intenta nuevamente."
    );
  }
}

/**
 * Get users with optional filters
 * @param params Query parameters for filtering
 * @returns Paginated list of users with company info
 */
export async function getUsers(
  params?: QueryUsersDto
): Promise<GetUsersResponse> {
  try {
    const response = await apiClient.get<GetUsersResponse>(
      "/superadmin/users",
      {
        params: {
          companyId: params?.companyId,
          username: params?.username,
          role: params?.role,
          page: params?.page || 1,
          limit: params?.limit || 20,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const axiosError = error as {
        response?: { status: number; data?: { message?: string } };
      };
      const message = axiosError.response?.data?.message;

      throw new (UserError as any)(
        message || "Error al cargar usuarios",
        axiosError.response?.status
      );
    }
    throw new (UserError as any)(
      "Error al cargar usuarios. Por favor intenta nuevamente."
    );
  }
}
