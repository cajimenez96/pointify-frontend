/**
 * SuperAdmin Users - Types and DTOs
 * Based on backend API documentation
 */

// ==================== Base Interfaces ====================

export interface Company {
  _id: string;
  companyCode: string;
  businessName: string;
}

export interface User {
  _id: string;
  companyId: string;
  username: string;
  name: string;
  dni: string;
  role: "admin" | "cashier" | "superadmin";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse extends User {
  company: Company; // Populated field
}

// ==================== DTOs ====================

export interface CreateUserBySuperAdminDto {
  companyId: string;
  username: string;
  password: string;
  name: string;
  dni: string;
  role: "admin" | "cashier";
}

export interface QueryUsersDto {
  companyId?: string;
  username?: string;
  role?: "admin" | "cashier" | "superadmin";
  page?: number;
  limit?: number;
}

// ==================== Response Types ====================

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetUsersResponse {
  data: UserResponse[];
  pagination: Pagination;
}

// ==================== Error Handling ====================

export class UserError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = "UserError";
  }
}
