/**
 * RewardsCatalog Component
 * Campaign rewards catalog (view-only)
 */

"use client";

import { Gift } from "lucide-react";
import { RewardCard } from "./RewardCard";
import type { RewardWithAffordability } from "@/repositories/clients/types";

interface RewardsCatalogProps {
  rewards: RewardWithAffordability[];
}

export function RewardsCatalog({ rewards }: RewardsCatalogProps) {
  if (rewards.length === 0) {
    return (
      <div className="text-center py-16">
        <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No hay premios en esta campaña</h3>
        <p className="text-muted-foreground">Vuelve pronto para ver los premios disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rewards.map((reward) => (
        <RewardCard key={reward._id} reward={reward} />
      ))}
    </div>
  );
}
