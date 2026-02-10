/**
 * RedeemTab Component
 * Tab for redeeming rewards (REDEEM operation)
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Gift, Lock, AlertCircle, Package } from "lucide-react";
import { useRedeemPoints } from "../hooks/useRedeemPoints";
import { useRewards } from "@/app/admin/settings/hooks/useRewards";
import { ClientSearchCard } from "./ClientSearchCard";
import type { ClientSummary } from "@/repositories/transactions/types";
import type { Reward } from "@/repositories/admin/settings/types";

export function RedeemTab() {
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(
    null,
  );
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const redeemMutation = useRedeemPoints();
  const { rewards, isLoading: loadingRewards } = useRewards(true); // Active only

  const handleClientFound = (client: ClientSummary) => {
    setSelectedClient(client);
  };

  // Mock search function
  const mockSearchClient = async (dni: string): Promise<ClientSummary> => {
    return {
      dni,
      name: `Cliente ${dni}`,
      status: "ACTIVE",
      currentPoints: 150, // Mock data
      totalAccumulated: 500,
    };
  };

  const handleRewardClick = (reward: Reward) => {
    if (!selectedClient) return;

    const canAfford = selectedClient.currentPoints >= reward.pointsCost;
    const hasStock = reward.stock === null || reward.stock > 0;

    if (canAfford && hasStock) {
      setSelectedReward(reward);
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmRedeem = async () => {
    if (!selectedClient || !selectedReward) return;

    try {
      const response = await redeemMutation.mutateAsync({
        dni: selectedClient.dni,
        rewardId: selectedReward._id,
      });

      // Update client points locally
      setSelectedClient({
        ...selectedClient,
        currentPoints: response.client.currentPoints,
      });

      setShowConfirmDialog(false);
      setSelectedReward(null);
    } catch (error) {
      // Error handled in hook
    }
  };

  const getRewardStatus = (reward: Reward) => {
    if (!selectedClient) return "disabled";

    const canAfford = selectedClient.currentPoints >= reward.pointsCost;
    const hasStock = reward.stock === null || reward.stock > 0;

    if (!hasStock) return "out-of-stock";
    if (!canAfford) return "locked";
    return "available";
  };

  const getPointsNeeded = (reward: Reward) => {
    if (!selectedClient) return reward.pointsCost;
    return Math.max(0, reward.pointsCost - selectedClient.currentPoints);
  };

  return (
    <div className="space-y-6">
      {/* Client Search */}
      <ClientSearchCard
        onClientFound={handleClientFound}
        onSearchDni={mockSearchClient}
        isLoading={redeemMutation.isPending}
      />

      {/* Rewards Grid - Only shown when client is selected */}
      {selectedClient && (
        <div>
          <h3 className="text-xl font-semibold mb-4">
            Premios Disponibles
          </h3>

          {loadingRewards ? (
            <div className="text-center py-12">
              <div className="inline-block h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : rewards.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">
                No hay premios disponibles en este momento
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map((reward) => {
                const status = getRewardStatus(reward);
                const pointsNeeded = getPointsNeeded(reward);
                const isClickable = status === "available";

                return (
                  <Card
                    key={reward._id}
                    className={`
                      p-5 transition-all
                      ${
                        status === "available"
                          ? "border-green-200 bg-green-50/50 hover:bg-green-50 hover:scale-105 cursor-pointer"
                          : "opacity-60 cursor-not-allowed"
                      }
                    `}
                    onClick={() => isClickable && handleRewardClick(reward)}
                  >
                    {/* Image */}
                    <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                      {reward.imageUrl ? (
                        <img
                          src={reward.imageUrl}
                          alt={reward.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Gift className="h-12 w-12 text-gray-300" />
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="font-semibold text-lg mb-1">
                      {reward.name}
                    </h4>

                    {/* Description */}
                    {reward.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {reward.description}
                      </p>
                    )}

                    {/* Points Cost */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {reward.pointsCost} pts
                      </span>

                      {/* Stock indicator */}
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        {reward.stock === null ? "∞" : reward.stock}
                      </div>
                    </div>

                    {/* Status Badge */}
                    {status === "available" && (
                      <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-center">
                        <span className="text-green-700 font-medium">
                          Disponible
                        </span>
                      </div>
                    )}

                    {status === "locked" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-yellow-600" />
                          <span className="text-yellow-700 text-sm">
                            Faltan {pointsNeeded} puntos
                          </span>
                        </div>
                        {/* Progress bar */}
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400"
                            style={{
                              width: `${(selectedClient.currentPoints / reward.pointsCost) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {status === "out-of-stock" && (
                      <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-center">
                        <span className="text-red-600 font-medium">
                          Sin stock
                        </span>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              Confirmar Canje
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de canjear este premio?
            </DialogDescription>
          </DialogHeader>

          {selectedReward && selectedClient && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Premio:</p>
                <p className="text-lg font-semibold">
                  {selectedReward.name}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Costo:</p>
                <p className="text-2xl font-bold text-primary">
                  {selectedReward.pointsCost} puntos
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Saldo restante:</p>
                <p className="text-xl font-semibold text-green-600">
                  {selectedClient.currentPoints - selectedReward.pointsCost}{" "}
                  puntos
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={redeemMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmRedeem}
              disabled={redeemMutation.isPending}
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {redeemMutation.isPending ? "Canjeando..." : "Confirmar Canje"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
