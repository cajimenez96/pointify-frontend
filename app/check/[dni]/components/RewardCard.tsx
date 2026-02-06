/**
 * RewardCard Component (Public View)
 * Card showing reward with affordability status
 */

"use client";

import { Card } from "@/components/ui/card";
import { Gift, Lock, Package, AlertCircle } from "lucide-react";
import type { RewardWithAffordability } from "@/repositories/clients/types";

interface RewardCardProps {
  reward: RewardWithAffordability;
}

export function RewardCard({ reward }: RewardCardProps) {
  const getStatusColor = () => {
    if (reward.stock === 0) return "red";
    if (reward.canAfford) return "green";
    return "yellow";
  };

  const statusColor = getStatusColor();

  return (
    <Card
      className={`
        p-5 transition-all
        ${
          reward.canAfford && reward.stock !== 0
            ? "border-green-700 bg-slate-800/70 hover:scale-105"
            : "border-slate-700 bg-slate-800/30 opacity-75"
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
      <h3 className="font-semibold text-white text-lg mb-2">{reward.name}</h3>

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

        {/* Stock indicator */}
        {reward.stock !== null && (
          <div className="flex items-center gap-1 text-sm text-slate-400">
            <Package className="h-4 w-4" />
            {reward.stock}
          </div>
        )}
      </div>

      {/* Status */}
      {reward.stock === 0 ? (
        <div className="bg-red-900/30 border border-red-700 rounded px-3 py-2 text-center">
          <div className="flex items-center justify-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span className="font-medium">Sin stock</span>
          </div>
        </div>
      ) : reward.canAfford ? (
        <div className="bg-green-900/30 border border-green-700 rounded px-3 py-2 text-center">
          <span className="text-green-400 font-medium">
            ✓ Disponible para canjear
          </span>
        </div>
      ) : (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded px-3 py-2">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-yellow-400" />
            <span className="text-yellow-400 text-sm font-medium">
              Te faltan {reward.pointsNeeded} puntos
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all"
              style={{
                width: `${((reward.pointsCost - reward.pointsNeeded) / reward.pointsCost) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Redemption Note */}
      {reward.canAfford && reward.stock !== 0 && (
        <p className="text-xs text-slate-500 mt-3 text-center">
          Muestra tu DNI en caja para canjear
        </p>
      )}
    </Card>
  );
}
