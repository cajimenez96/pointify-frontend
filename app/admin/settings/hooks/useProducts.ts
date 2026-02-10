/**
 * useProducts Hook
 * Manages product points configuration with TanStack Query
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getActiveProducts,
  createProduct,
  updateProductPoints,
  deleteProduct,
} from '@/repositories/settings/settings';
import type {
  ProductPoints,
  CreateProductDto,
  UpdateProductPointsDto,
} from '@/repositories/settings/types';

export function useProducts() {
  const queryClient = useQueryClient();

  const productsQuery = useQuery<ProductPoints[]>({
    queryKey: ['admin', 'products'],
    queryFn: getActiveProducts,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateProductDto) => createProduct(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Producto creado exitosamente');
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Error al crear producto'),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productName,
      dto,
    }: {
      productName: string;
      dto: UpdateProductPointsDto;
    }) => updateProductPoints(productName, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Producto actualizado exitosamente');
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Error al actualizar producto'),
  });

  const deleteMutation = useMutation({
    mutationFn: (productName: string) => deleteProduct(productName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success('Producto eliminado exitosamente');
    },
    onError: (error: Error) =>
      toast.error(error.message || 'Error al eliminar producto'),
  });

  return {
    products: productsQuery.data ?? [],
    isLoading: productsQuery.isLoading,
    error: productsQuery.error,
    createProduct: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateProduct: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
