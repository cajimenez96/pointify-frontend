/**
 * SuperAdmin Companies Repository
 * Handles all API calls for company management
 */

import apiClient from '@/lib/api-client';
import { CompanyError } from './types';
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
  QueryCompaniesDto,
  CompaniesListResponse,
  CompanyResponse,
  ApiError,
} from './types';

const BASE_PATH = '/superadmin/companies';

/**
 * Creates a new company in the system
 * @throws {CompanyError} If creation fails
 */
export async function createCompany(
  dto: CreateCompanyDto
): Promise<CompanyResponse> {
  try {
    const response = await apiClient.post<CompanyResponse>(BASE_PATH, dto);
    return response.data;
  } catch (error: unknown) {
    throw handleCompanyError(error);
  }
}

/**
 * Fetches companies list with pagination and optional filters
 */
export async function getCompanies(
  query: QueryCompaniesDto = {}
): Promise<CompaniesListResponse> {
  try {
    const response = await apiClient.get<CompaniesListResponse>(BASE_PATH, {
      params: {
        ...query,
        page: query.page || 1,
        limit: query.limit || 20,
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw handleCompanyError(error);
  }
}

/**
 * Updates an existing company
 * @param id - Company MongoDB ObjectId
 * @param dto - Fields to update
 * @throws {CompanyError} If update fails or company not found
 */
export async function updateCompany(
  id: string,
  dto: UpdateCompanyDto
): Promise<CompanyResponse> {
  try {
    const response = await apiClient.patch<CompanyResponse>(
      `${BASE_PATH}/${id}`,
      dto
    );
    return response.data;
  } catch (error: unknown) {
    throw handleCompanyError(error);
  }
}

/**
 * Handles API errors and converts them to CompanyError
 */
function handleCompanyError(error: unknown): CompanyError {
  if (error instanceof Error && 'response' in error) {
    const axiosError = error as {
      response?: { data?: ApiError; status?: number };
    };
    
    if (axiosError.response?.data) {
      const apiError = axiosError.response.data;
      const message = Array.isArray(apiError.message)
        ? apiError.message.join(', ')
        : apiError.message;
      
      return new CompanyError(
        message,
        apiError.statusCode,
        apiError
      );
    }
  }
  
  return new CompanyError(
    error instanceof Error ? error.message : 'Error desconocido',
    500
  );
}
