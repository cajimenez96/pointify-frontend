/**
 * RewardsGrid Component
 * Grid display for managing rewards catalog
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gift, Plus, Edit, Trash2, Package, AlertCircle } from "lucide-react";
import { RewardDialog } from "./RewardDialog";
import { useRewards } from "../hooks/useRewards";
import type { Reward } from "@/repositories/admin/settings/types";

export function RewardsGrid() {
  const { rewards, isLoading, deleteRewardMutation } = useRewards(false); // Get all, including inactive
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setIsDialogOpen(true);
  };

  const handleDelete = async (rewardId: string, rewardName: string) => {
    if (!confirm(`¿Estás seguro de desactivar "${rewardName}"?`)) return;

    setIsDeleting(true);
    try {
      await deleteRewardMutation(rewardId);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingReward(null);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center border-slate-700 bg-slate-800/50">
        <div className="inline-block h-12 w-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Gift className="h-6 w-6" />
          Catálogo de Premios
        </h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar Premio
        </Button>
      </div>

      {rewards.length === 0 ? (
        <Card className="p-12 text-center border-slate-700 bg-slate-800/50">
          <Gift className="h-16 w-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 text-lg mb-4">
            No hay premios en el catálogo
          </p>
          <p className="text-slate-500 text-sm mb-6">
            Agrega premios para que los clientes puedan canjear sus puntos
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            Crear Primer Premio
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <Card
              key={reward._id}
              className={`
                p-5 border-slate-700 transition-all
                ${
                  reward.isActive
                    ? "bg-slate-800/70"
                    : "bg-slate-800/30 opacity-60"
                }
              `}
            >
              {/* Image */}
              <div className="aspect-video bg-slate-900 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {reward.imageUrl ? (
                  <img
                    src={reward.imageUrl}
                    alt={reward.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Gift className="h-16 w-16 text-slate-600" />
                )}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-white text-lg mb-2">
                {reward.name}
              </h3>

              {/* Description */}
              {reward.description && (
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {reward.description}
                </p>
              )}

              {/* Points Cost */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-500">Costo</p>
                  <span className="text-2xl font-bold text-violet-400">
                    {reward.pointsCost} pts
                  </span>
                </div>

                {/* Stock */}
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Stock</p>
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4 text-slate-400" />
                    <span
                      className={`font-semibold ${
                        reward.stock === null
                          ? "text-green-400"
                          : reward.stock === 0
                            ? "text-red-400"
                            : "text-white"
                      }`}
                    >
                      {reward.stock === null ? "∞" : reward.stock}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex gap-2 mb-4">
                {reward.isActive ? (
                  <Badge className="bg-green-900/30 border-green-700 text-green-400">
                    ✓ Activo
                  </Badge>
                ) : (
                  <Badge className="bg-slate-700 border-slate-600 text-slate-400">
                    Inactivo
                  </Badge>
                )}

                {reward.stock === 0 && (
                  <Badge className="bg-red-900/30 border-red-700 text-red-400">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Sin stock
                  </Badge>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(reward)}
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(reward._id, reward.name)}
                  disabled={isDeleting || !reward.isActive}
                  className="border-red-700 text-red-400 hover:bg-red-900/30 disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <RewardDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingReward={editingReward}
      />
    </div>
  );
}
