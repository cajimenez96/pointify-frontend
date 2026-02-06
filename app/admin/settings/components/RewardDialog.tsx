/**
 * RewardDialog Component
 * Modal for creating and editing rewards
 */

"use client";

import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useRewards } from "../hooks/useRewards";
import { rewardSchema, type RewardForm } from "../schemas";
import type { Reward } from "@/repositories/admin/settings/types";

interface RewardDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingReward: Reward | null;
}

export function RewardDialog({
  isOpen,
  onClose,
  editingReward,
}: RewardDialogProps) {
  const { createRewardMutation, updateRewardMutation } = useRewards();
  const [isUnlimited, setIsUnlimited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<RewardForm>({
    resolver: zodResolver(rewardSchema),
  });

  // Watch stock to enable/disable unlimited checkbox
  const stockValue = watch("stock");

  useEffect(() => {
    if (editingReward) {
      setValue("name", editingReward.name);
      setValue("description", editingReward.description || "");
      setValue("pointsCost", editingReward.pointsCost);
      setValue("imageUrl", editingReward.imageUrl || "");

      if (editingReward.stock === null) {
        setIsUnlimited(true);
        setValue("stock", undefined);
      } else {
        setIsUnlimited(false);
        setValue("stock", editingReward.stock);
      }
    } else {
      reset();
      setIsUnlimited(false);
    }
  }, [editingReward, setValue, reset]);

  const onSubmit = async (data: RewardForm) => {
    try {
      // Prepare DTO
      const dto = {
        name: data.name,
        description: data.description || undefined,
        pointsCost: data.pointsCost,
        imageUrl: data.imageUrl || undefined,
        stock: isUnlimited ? null : (data.stock ?? 0),
      };

      if (editingReward) {
        // Update existing reward
        await updateRewardMutation(editingReward._id, {
          ...dto,
          isActive: true, // Keep active when editing
        });
      } else {
        // Create new reward
        await createRewardMutation(dto);
      }

      reset();
      setIsUnlimited(false);
      onClose();
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleClose = () => {
    reset();
    setIsUnlimited(false);
    onClose();
  };

  const handleUnlimitedChange = (checked: boolean) => {
    setIsUnlimited(checked);
    if (checked) {
      setValue("stock", undefined);
    } else {
      setValue("stock", 0);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {editingReward ? "Editar Premio" : "Nuevo Premio"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {editingReward
              ? "Modifica los detalles del premio"
              : "Configura un nuevo premio para el catálogo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          {/* Name */}
          <div>
            <Label htmlFor="name" className="text-slate-300">
              Nombre del Premio *
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="ej: Café Gratis"
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-slate-300">
              Descripción (opcional)
            </Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descripción del premio..."
              rows={3}
              className="mt-1 bg-slate-800 border-slate-600 text-white resize-none"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Points Cost */}
          <div>
            <Label htmlFor="pointsCost" className="text-slate-300">
              Costo en Puntos *
            </Label>
            <Input
              id="pointsCost"
              type="number"
              {...register("pointsCost", { valueAsNumber: true })}
              placeholder="50"
              min={1}
              max={100000}
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              disabled={isSubmitting}
            />
            {errors.pointsCost && (
              <p className="text-red-400 text-sm mt-1">
                {errors.pointsCost.message}
              </p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              Puntos que el cliente necesita para canjear este premio
            </p>
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="stock" className="text-slate-300">
              Stock Disponible
            </Label>

            <div className="flex items-center gap-3 mb-2">
              <Checkbox
                id="unlimited"
                checked={isUnlimited}
                onCheckedChange={handleUnlimitedChange}
                disabled={isSubmitting}
              />
              <label
                htmlFor="unlimited"
                className="text-sm text-slate-300 cursor-pointer"
              >
                Stock Ilimitado
              </label>
            </div>

            <Input
              id="stock"
              type="number"
              {...register("stock", { valueAsNumber: true })}
              placeholder="100"
              min={0}
              max={999999}
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              disabled={isSubmitting || isUnlimited}
            />
            {errors.stock && (
              <p className="text-red-400 text-sm mt-1">
                {errors.stock.message}
              </p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              {isUnlimited
                ? "Este premio tiene stock infinito"
                : "Cantidad disponible para canjear. Se reducirá automáticamente."}
            </p>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="imageUrl" className="text-slate-300">
              URL de Imagen (opcional)
            </Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="mt-1 bg-slate-800 border-slate-600 text-white"
              disabled={isSubmitting}
            />
            {errors.imageUrl && (
              <p className="text-red-400 text-sm mt-1">
                {errors.imageUrl.message}
              </p>
            )}
            <p className="text-slate-500 text-xs mt-1">
              URL pública de la imagen del premio
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
                : editingReward
                  ? "Actualizar Premio"
                  : "Crear Premio"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
