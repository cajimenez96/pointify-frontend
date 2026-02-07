/**
 * Unit tests for SuperAdmin Companies Repository
 * Tests API calls and error handling for CRUD operations
 */

import {
  createCompany,
  getCompanies,
  updateCompany,
} from '@/repositories/superadmin/companies/companies';
import { CompanyError } from '@/repositories/superadmin/companies/types';
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
} from '@/repositories/superadmin/companies/types';

// Mock apiClient (default export)
jest.mock('@/lib/api-client', () => {
  const mock = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    __esModule: true,
    default: mock,
    apiClient: mock,
  };
});

import apiClient from '@/lib/api-client';

const mockPost = apiClient.post as jest.Mock;
const mockGet = apiClient.get as jest.Mock;
const mockPatch = apiClient.patch as jest.Mock;

describe('SuperAdmin Companies Repository', () => {
  const mockCompany = {
    _id: '507f1f77bcf86cd799439011',
    companyCode: 'ESP001',
    businessName: 'Empresa Test',
    cuitCuil: '30123456789',
    address: 'Calle Test 123',
    contactInfo: {
      name: 'Juan Test',
      phone: '1234567890',
      email: 'test@empresa.com',
    },
    isActive: true,
    subscriptionEndDate: '2027-12-31T23:59:59Z',
    maxUsers: 50,
    maxClients: 1000,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCompany', () => {
    const createDto: CreateCompanyDto = {
      companyCode: 'ESP001',
      businessName: 'Empresa Test',
      cuitCuil: '30123456789',
      contactInfo: {
        name: 'Juan Test',
        phone: '1234567890',
        email: 'test@empresa.com',
      },
      subscriptionEndDate: '2027-12-31T23:59:59Z',
      maxUsers: 50,
      maxClients: 1000,
    };

    it('should create company successfully', async () => {
      mockPost.mockResolvedValue({ data: mockCompany });

      const result = await createCompany(createDto);

      expect(mockPost).toHaveBeenCalledWith('/superadmin/companies', createDto);
      expect(result).toEqual(mockCompany);
    });

    it('should throw CompanyError on 409 duplicate companyCode', async () => {
      const axiosError = new Error('Conflict') as any;
      axiosError.response = {
        status: 409,
        data: {
          statusCode: 409,
          message: 'Company code ESP001 already exists',
          error: 'Conflict',
        },
      };

      mockPost.mockRejectedValue(axiosError);

      try {
        await createCompany(createDto);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CompanyError);
        expect((error as CompanyError).message).toBe(
          'Company code ESP001 already exists'
        );
        expect((error as CompanyError).statusCode).toBe(409);
      }
    });

    it('should throw CompanyError on network error', async () => {
      mockPost.mockRejectedValue(new Error('Network Error'));

      await expect(createCompany(createDto)).rejects.toThrow(CompanyError);
    });
  });

  describe('getCompanies', () => {
    const mockResponse = {
      data: [mockCompany],
      pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
    };

    it('should fetch companies with default pagination', async () => {
      mockGet.mockResolvedValue({ data: mockResponse });

      const result = await getCompanies();

      expect(mockGet).toHaveBeenCalledWith('/superadmin/companies', {
        params: { page: 1, limit: 20 },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should pass filters and pagination params', async () => {
      mockGet.mockResolvedValue({ data: mockResponse });

      await getCompanies({
        businessName: 'Test',
        isActive: true,
        page: 2,
        limit: 10,
      });

      expect(mockGet).toHaveBeenCalledWith('/superadmin/companies', {
        params: {
          businessName: 'Test',
          isActive: true,
          page: 2,
          limit: 10,
        },
      });
    });

    it('should handle empty results', async () => {
      const emptyResponse = {
        data: [],
        pagination: { total: 0, page: 1, limit: 20, totalPages: 0 },
      };
      mockGet.mockResolvedValue({ data: emptyResponse });

      const result = await getCompanies();

      expect(result.data).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('should throw CompanyError on API error', async () => {
      const axiosError = new Error('Forbidden') as any;
      axiosError.response = {
        status: 403,
        data: {
          statusCode: 403,
          message: 'Requires SuperAdmin permissions',
          error: 'Forbidden',
        },
      };

      mockGet.mockRejectedValue(axiosError);

      await expect(getCompanies()).rejects.toThrow(CompanyError);
    });
  });

  describe('updateCompany', () => {
    const updateDto: UpdateCompanyDto = {
      businessName: 'Empresa Actualizada',
      isActive: false,
    };

    it('should update company successfully', async () => {
      const updatedCompany = { ...mockCompany, ...updateDto };
      mockPatch.mockResolvedValue({ data: updatedCompany });

      const result = await updateCompany(mockCompany._id, updateDto);

      expect(mockPatch).toHaveBeenCalledWith(
        `/superadmin/companies/${mockCompany._id}`,
        updateDto
      );
      expect(result.businessName).toBe('Empresa Actualizada');
      expect(result.isActive).toBe(false);
    });

    it('should throw CompanyError on 404 not found', async () => {
      const axiosError = new Error('Not found') as any;
      axiosError.response = {
        status: 404,
        data: {
          statusCode: 404,
          message: 'Empresa no encontrada',
          error: 'Not Found',
        },
      };

      mockPatch.mockRejectedValue(axiosError);

      try {
        await updateCompany('invalid-id', updateDto);
        fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(CompanyError);
        expect((error as CompanyError).statusCode).toBe(404);
      }
    });

    it('should throw CompanyError on 400 immutable fields', async () => {
      const axiosError = new Error('Bad request') as any;
      axiosError.response = {
        status: 400,
        data: {
          statusCode: 400,
          message:
            'No se permite modificar companyCode ni cuitCuil después de la creación',
          error: 'Bad Request',
        },
      };

      mockPatch.mockRejectedValue(axiosError);

      await expect(
        updateCompany(mockCompany._id, { businessName: 'test' })
      ).rejects.toThrow(CompanyError);
    });
  });
});
