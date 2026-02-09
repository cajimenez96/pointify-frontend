"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProducts } from "../hooks/useProducts";
import { productSchema, type ProductForm } from "../schemas";
import type { ProductPoints } from "@/repositories/admin/settings/types";

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: ProductPoints | null;
}

export function ProductDialog({
  isOpen,
  onClose,
  editingProduct,
}: ProductDialogProps) {
  const { createProduct, updateProduct } = useProducts();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (editingProduct) {
      setValue("productName", editingProduct.productName);
      setValue("pointsValue", editingProduct.pointsValue);
    } else {
      reset();
    }
  }, [editingProduct, setValue, reset]);

  const onSubmit = async (data: ProductForm) => {
    try {
      if (editingProduct) {
        await updateProduct({
          productName: editingProduct.productName,
          dto: { pointsValue: data.pointsValue },
        });
      } else {
        await createProduct({
          productName: data.productName,
          pointsValue: data.pointsValue,
        });
      }
      reset();
      onClose();
    } catch {
      // Error handled in hook via toast
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? "Modifica los puntos del producto"
              : "Configura un producto y su valor en puntos"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="productName">Nombre del Producto</Label>
            <Input
              id="productName"
              {...register("productName")}
              placeholder="ej: Café Espresso"
              className="mt-1"
              disabled={!!editingProduct || isSubmitting}
            />
            {errors.productName && (
              <p className="text-red-600 text-sm mt-1">
                {errors.productName.message}
              </p>
            )}
            {editingProduct && (
              <p className="text-gray-400 text-xs mt-1">
                El nombre no puede modificarse
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="pointsValue">Puntos Otorgados</Label>
            <Input
              id="pointsValue"
              type="number"
              {...register("pointsValue", { valueAsNumber: true })}
              placeholder="10"
              min={1}
              max={10000}
              className="mt-1"
              disabled={isSubmitting}
            />
            {errors.pointsValue && (
              <p className="text-red-600 text-sm mt-1">
                {errors.pointsValue.message}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Puntos que el cliente recibe al comprar este producto
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : editingProduct
                  ? "Actualizar"
                  : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
