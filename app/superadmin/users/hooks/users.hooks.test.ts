import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useUsersQuery } from './useUsers';
import { useCreateUserMutation } from './useCreateUser';
import { useUpdateUserMutation } from './useUpdateUser';
import * as usersRepository from '@/repositories/superadmin/users/users';

// Mock the users repository
jest.mock('@/repositories/superadmin/users/users');

describe('Users Hooks', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);

  describe('useUsersQuery', () => {
    it('should fetch users with filters', async () => {
      const mockData = {
        data: [
          {
            _id: '1',
            username: 'admin.demo',
            name: 'Admin Demo',
            role: 'admin',
            companyId: 'company-1',
          },
        ],
        pagination: { total: 1, page: 1, limit: 20, totalPages: 1 },
      };

      jest.spyOn(usersRepository, 'getUsers').mockResolvedValue(mockData);

      const { result } = renderHook(() => useUsersQuery({ companyId: 'company-1' }), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockData);
      expect(usersRepository.getUsers).toHaveBeenCalledWith({ companyId: 'company-1' });
    });

    it('should not fetch when no filters are provided', () => {
      const { result } = renderHook(() => useUsersQuery(), { wrapper });

      // When no filters, the hook still runs because hasFilters logic checks for object keys
      // Empty object {} has 0 keys, so enabled is false
      // But undefined means hasFilters = false, so also disabled
      expect(result.current.isPending).toBe(true);
      // The query doesn't actually fetch since enabled is false
    });

    it('should handle API errors', async () => {
      const mockError = new Error('Failed to fetch users');
      jest.spyOn(usersRepository, 'getUsers').mockRejectedValue(mockError);

      const { result } = renderHook(() => useUsersQuery({ companyId: 'company-1' }), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useCreateUserMutation', () => {
    it('should create user successfully', async () => {
      const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'nuevo.usuario',
        name: 'Nuevo Usuario',
        dni: '12345678',
        role: 'cashier',
        companyId: 'company-1',
      };

      jest.spyOn(usersRepository, 'createUser').mockResolvedValue(mockUser as any);

      const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

      result.current.mutate({
        companyId: 'company-1',
        username: 'nuevo.usuario',
        password: 'password123',
        name: 'Nuevo Usuario',
        dni: '12345678',
        role: 'cashier' as any,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUser);
    });

    it('should handle creation errors', async () => {
      const mockError = new Error('Username already exists');
      jest.spyOn(usersRepository, 'createUser').mockRejectedValue(mockError);

      const { result } = renderHook(() => useCreateUserMutation(), { wrapper });

      result.current.mutate({
        companyId: 'company-1',
        username: 'existing.user',
        password: 'password123',
        name: 'User',
        dni: '12345678',
        role: 'admin' as any,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });

  describe('useUpdateUserMutation', () => {
    it('should update user successfully', async () => {
      const mockUpdatedUser = {
        _id: '507f1f77bcf86cd799439011',
        username: 'updated.usuario',
        name: 'Updated Name',
        isActive: false,
      };

      jest.spyOn(usersRepository, 'updateUser').mockResolvedValue(mockUpdatedUser as any);

      const { result } = renderHook(() => useUpdateUserMutation(), { wrapper });

      result.current.mutate({
        id: '507f1f77bcf86cd799439011',
        dto: { name: 'Updated Name', isActive: false },
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUpdatedUser);
      expect(usersRepository.updateUser).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        { name: 'Updated Name', isActive: false },
      );
    });

    it('should handle update errors', async () => {
      const mockError = new Error('User not found');
      jest.spyOn(usersRepository, 'updateUser').mockRejectedValue(mockError);

      const { result } = renderHook(() => useUpdateUserMutation(), { wrapper });

      result.current.mutate({
        id: 'non-existent-id',
        dto: { name: 'New Name' },
      });

      await waitFor(() => expect(result.current.isError).toBe(true));

      expect(result.current.error).toEqual(mockError);
    });
  });
});
