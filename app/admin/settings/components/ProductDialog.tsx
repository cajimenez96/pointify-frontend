/**
 * ProductDialog Component
 * Modal for creating and editing products
 */

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
  const { createProductMutation, updateProductMutation } = useProducts();

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
        // Update existing product
        await updateProductMutation(editingProduct.productName, {
          pointsValue: data.pointsValue,
        });
      } else {
        // Create new product
        await createProductMutation({
          productName: data.productName,
          pointsValue: data.pointsValue,
        });
      }

      reset();
      onClose();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {editingProduct ? "Editar Producto" : "Nuevo Producto"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {editingProduct
              ? "Modifica los puntos del producto"
              : "Configura un producto y su valor en puntos"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Product Name */}
          <div>
            <Label htmlFor="productName" className="text-slate-300">
              Nombre del Producto
            </Label>
            <Input
              id="productName"
              {...register("productName")}
              placeholder="ej: Café Espresso"
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              disabled={!!editingProduct || isSubmitting}
            />
            {errors.productName && (
              <p className="text-red-400 text-sm mt-1">
                {errors.productName.message}
              </p>
            )}
            {editingProduct && (
              <p className="text-slate-500 text-xs mt-1">
                El nombre no puede modificarse
              </p>
            )}
          </div>

          {/* Points Value */}
          <div>
            <Label htmlFor="pointsValue" className="text-slate-300">
              Puntos Otorgados
            </Label>
            <Input
              id="pointsValue"
              type="number"
              {...register("pointsValue", { valueAsNumber: true })}
              placeholder="10"
              min={1}
              max={10000}
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              disabled={isSubmitting}
            />
            {errors.pointsValue && (
              <p className="text-red-400 text-sm mt-1">
                {errors.pointsValue.message}
              </p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              Puntos que el cliente recibe al comprar este producto
            </p>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
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
