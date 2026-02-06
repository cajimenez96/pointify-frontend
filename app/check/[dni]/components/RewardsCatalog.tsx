/**
 * RewardsCatalog Component
 * Grid of rewards with filter tabs
 */

"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gift, Lock, Check, AlertCircle } from "lucide-react";
import { RewardCard } from "./RewardCard";
import type { RewardWithAffordability } from "@/repositories/clients/types";

interface RewardsCatalogProps {
  rewards: RewardWithAffordability[];
}

export function RewardsCatalog({ rewards }: RewardsCatalogProps) {
  const availableRewards = rewards.filter((r) => r.canAfford && r.stock !== 0);
  const lockedRewards = rewards.filter((r) => !r.canAfford && r.stock !== 0);
  const outOfStock = rewards.filter((r) => r.stock === 0);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-800 border border-slate-700">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
          >
            <Gift className="h-4 w-4 mr-2" />
            Todos ({rewards.length})
          </TabsTrigger>
          <TabsTrigger
            value="available"
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >
            <Check className="h-4 w-4 mr-2" />
            Disponibles ({availableRewards.length})
          </TabsTrigger>
          <TabsTrigger
            value="locked"
            className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
          >
            <Lock className="h-4 w-4 mr-2" />
            Bloqueados ({lockedRewards.length})
          </TabsTrigger>
        </TabsList>

        {/* All Rewards */}
        <TabsContent value="all">
          {rewards.length === 0 ? (
            <EmptyState
              icon={<AlertCircle className="h-16 w-16 text-slate-600" />}
              title="No hay premios disponibles"
              description="Vuelve pronto para ver los premios"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rewards.map((reward) => (
                <RewardCard key={reward._id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Available Rewards */}
        <TabsContent value="available">
          {availableRewards.length === 0 ? (
            <EmptyState
              icon={<Lock className="h-16 w-16 text-slate-600" />}
              title="No tienes premios disponibles"
              description="Sigue acumulando puntos para desbloquear premios"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward) => (
                <RewardCard key={reward._id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Locked Rewards */}
        <TabsContent value="locked">
          {lockedRewards.length === 0 ? (
            <EmptyState
              icon={<Check className="h-16 w-16 text-green-600" />}
              title="¡Felicidades!"
              description="Puedes canjear todos los premios disponibles"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lockedRewards.map((reward) => (
                <RewardCard key={reward._id} reward={reward} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Empty State Component
function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center py-16">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}
