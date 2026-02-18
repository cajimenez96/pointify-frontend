"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, Edit, CircleOff, CheckCircle } from "lucide-react";
import { Container } from "@/components/common/Container";
import { RewardDialog } from "./RewardDialog";
import { useRewards } from "../hooks/useRewards";
import type { Reward } from "@/repositories/settings/types";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

export function RewardsGrid() {
  // Traemos TODOS los premios y filtramos localmente
  const {
    rewards,
    isLoading,
    deleteReward,
    isDeleting,
    updateReward,
    isUpdating,
  } = useRewards(false);

  const activeRewards = rewards.filter((r) => r.isActive);
  const inactiveRewards = rewards.filter((r) => !r.isActive);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    confirmVariant: "default" | "destructive";
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
    confirmLabel: "Confirmar",
    confirmVariant: "default",
    onConfirm: () => {},
  });
  const closeConfirmDialog = () =>
    setConfirmDialog((prev) => ({ ...prev, isOpen: false }));

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setIsDialogOpen(true);
  };

  const handleDelete = (rewardId: string, rewardName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Desactivar premio",
      description: `¿Estás seguro de desactivar "${rewardName}"? Dejará de ser visible para los clientes.`,
      confirmLabel: "Desactivar",
      confirmVariant: "destructive",
      onConfirm: async () => {
        await deleteReward(rewardId);
        closeConfirmDialog();
      },
    });
  };


  
  const handleReactivate = (rewardId: string, rewardName: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Reactivar premio",
      description: `¿Querés reactivar "${rewardName}"? Volverá a ser visible para los clientes.`,
      confirmLabel: "Reactivar",
      confirmVariant: "default",
      onConfirm: async () => {
        await updateReward({ rewardId, dto: { isActive: true } });
        closeConfirmDialog();
      },
    });
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingReward(null);
  };

  const getStockLabel = (stock: number | null) => {
    if (stock === null) return "Ilimitado";
    if (stock === 0) return "Sin stock";
    return `Stock: ${stock}`;
  };

  const getStockColor = (stock: number | null) => {
    if (stock === null) return "text-success";
    if (stock === 0) return "text-danger";
    return "text-gray-600";
  };
  // Componente interno para reutilizar la fila
  const RewardRow = ({
    reward,
    isInactive = false,
  }: {
    reward: Reward;
    isInactive?: boolean;
  }) => (
    <div
      key={reward._id}
      className={`flex items-center gap-4 py-4 first:pt-0 last:pb-0 ${isInactive ? "opacity-60" : ""}`}
    >
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
        {reward.imageUrl ? (
          <img
            src={reward.imageUrl}
            alt={reward.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Gift className="h-6 w-6 text-primary" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{reward.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge
            variant={reward.isActive ? "default" : "secondary"}
            className="text-xs px-1.5 py-0"
          >
            {reward.isActive ? "Activo" : "Inactivo"}
          </Badge>
          <span className="text-gray-400 text-xs">·</span>
          <span className={`text-xs ${getStockColor(reward.stock)}`}>
            {getStockLabel(reward.stock)}
          </span>
        </div>
      </div>

      <span className="font-bold text-primary text-sm whitespace-nowrap">
        {reward.pointsCost} pts
      </span>

      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-gray-500 hover:text-gray-900"
          onClick={() => handleEdit(reward)}
        >
          <Edit className="h-4 w-4" />
        </Button>

        {isInactive ? (
          // Botón reactivar
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-success"
            onClick={() => handleReactivate(reward._id, reward.name)}
            disabled={isUpdating}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        ) : (
          // Botón desactivar
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-danger"
            onClick={() => handleDelete(reward._id, reward.name)}
            disabled={isDeleting}
          >
            <CircleOff className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Container>
        <div className="py-8 text-center">
          <div className="inline-block h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Container>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Catálogo de Premios
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Premios que los clientes pueden canjear con sus puntos
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Premio
        </Button>
      </div>

      {/* Premios Activos */}
      <Container>
        {activeRewards.length === 0 ? (
          <div className="py-12 text-center">
            <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              No hay premios en el catálogo
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Agrega premios para que los clientes puedan canjear sus puntos
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Premio
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {activeRewards.map((reward) => (
              <RewardRow key={reward._id} reward={reward} />
            ))}
          </div>
        )}
      </Container>

      {/* Premios Inactivos — solo se muestra si hay alguno */}
      {inactiveRewards.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Premios Inactivos
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Estos premios no son visibles para los clientes
            </p>
          </div>
          <Container>
            <div className="divide-y divide-gray-200">
              {inactiveRewards.map((reward) => (
                <RewardRow key={reward._id} reward={reward} isInactive />
              ))}
            </div>
          </Container>
        </div>
      )}

      <RewardDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingReward={editingReward}
      />
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel={confirmDialog.confirmLabel}
        confirmVariant={confirmDialog.confirmVariant}
        isLoading={isDeleting || isUpdating}
      />
    </div>
  );
}
