/**
 * useProducts Hook
 * Manages product points configuration
 */

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import {
  getActiveProducts,
  createProduct,
  updateProductPoints,
  deleteProduct,
} from '@/repositories/admin/settings/settings';
import type {
  ProductPoints,
  CreateProductDto,
  UpdateProductPointsDto,
} from '@/repositories/admin/settings/types';

interface UseProductsReturn {
  products: ProductPoints[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProductMutation: (dto: CreateProductDto) => Promise<void>;
  updateProductMutation: (
    productName: string,
    dto: UpdateProductPointsDto
  ) => Promise<void>;
  deleteProductMutation: (productName: string) => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<ProductPoints[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getActiveProducts();
      setProducts(data);
    } catch (err: any) {
      const message = err.message || 'Error al cargar productos';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProductMutation = async (dto: CreateProductDto) => {
    try {
      await createProduct(dto);
      toast.success('Producto creado exitosamente');
      await fetchProducts(); // Refresh list
    } catch (err: any) {
      toast.error(err.message || 'Error al crear producto');
      throw err;
    }
  };

  const updateProductMutation = async (
    productName: string,
    dto: UpdateProductPointsDto
  ) => {
    try {
      await updateProductPoints(productName, dto);
      toast.success('Producto actualizado exitosamente');
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error al actualizar producto');
      throw err;
    }
  };

  const deleteProductMutation = async (productName: string) => {
    try {
      await deleteProduct(productName);
      toast.success('Producto eliminado exitosamente');
      await fetchProducts();
    } catch (err: any) {
      toast.error(err.message || 'Error al eliminar producto');
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    error,
    refetch: fetchProducts,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
}
