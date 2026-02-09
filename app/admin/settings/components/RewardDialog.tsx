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
  const { createReward, updateReward } = useRewards();
  const [isUnlimited, setIsUnlimited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<RewardForm>({
    resolver: zodResolver(rewardSchema),
  });

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
      const dto = {
        name: data.name,
        description: data.description || undefined,
        pointsCost: data.pointsCost,
        imageUrl: data.imageUrl || undefined,
        stock: isUnlimited ? null : (data.stock ?? 0),
      };

      if (editingReward) {
        await updateReward({
          rewardId: editingReward._id,
          dto: { ...dto, isActive: true },
        });
      } else {
        await createReward(dto);
      }

      reset();
      setIsUnlimited(false);
      onClose();
    } catch {
      // Error handled in hook via toast
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingReward ? "Editar Premio" : "Nuevo Premio"}
          </DialogTitle>
          <DialogDescription>
            {editingReward
              ? "Modifica los detalles del premio"
              : "Configura un nuevo premio para el catálogo"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Nombre del Premio *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="ej: Café Gratis"
              className="mt-1"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descripción del premio..."
              rows={3}
              className="mt-1 resize-none"
              disabled={isSubmitting}
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="pointsCost">Costo en Puntos *</Label>
            <Input
              id="pointsCost"
              type="number"
              {...register("pointsCost", { valueAsNumber: true })}
              placeholder="50"
              min={1}
              max={100000}
              className="mt-1"
              disabled={isSubmitting}
            />
            {errors.pointsCost && (
              <p className="text-red-600 text-sm mt-1">
                {errors.pointsCost.message}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Puntos que el cliente necesita para canjear este premio
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock">Stock Disponible</Label>
            <div className="flex items-center gap-3 mb-2">
              <Checkbox
                id="unlimited"
                checked={isUnlimited}
                onCheckedChange={handleUnlimitedChange}
                disabled={isSubmitting}
              />
              <label
                htmlFor="unlimited"
                className="text-sm text-gray-700 cursor-pointer"
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
              className="mt-1"
              disabled={isSubmitting || isUnlimited}
            />
            {errors.stock && (
              <p className="text-red-600 text-sm mt-1">
                {errors.stock.message}
              </p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              {isUnlimited
                ? "Este premio tiene stock infinito"
                : "Cantidad disponible para canjear. Se reducirá automáticamente."}
            </p>
          </div>

          <div>
            <Label htmlFor="imageUrl">URL de Imagen (opcional)</Label>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="mt-1"
              disabled={isSubmitting}
            />
            {errors.imageUrl && (
              <p className="text-red-600 text-sm mt-1">
                {errors.imageUrl.message}
              </p>
            )}
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
