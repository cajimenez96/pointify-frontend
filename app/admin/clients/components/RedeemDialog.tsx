import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Gift, Coins, AlertCircle } from "lucide-react";
import { useRewards } from "@/app/admin/settings/hooks/useRewards";
import { useRedeemPoints } from "../hooks/useRedeemPoints";
import type { Client } from "@/repositories/clients/types";
import { toast } from "sonner";

interface RedeemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null;
}

export function RedeemDialog({ isOpen, onClose, client }: RedeemDialogProps) {
  const { rewards, isLoading: isLoadingRewards } = useRewards(true); // Fetch only active rewards
  const { redeemPoints, isRedeeming } = useRedeemPoints();
  const [selectedRewardId, setSelectedRewardId] = useState<string>("");

  const selectedReward = rewards.find((r) => r._id === selectedRewardId);

  const handleRedeem = async () => {
    if (!client || !selectedRewardId) return;

    // Double check affordability
    if (selectedReward && client.currentPoints < selectedReward.pointsCost) {
      toast.error("El cliente no tiene suficientes puntos");
      return;
    }

    try {
      await redeemPoints({
        dni: client.dni,
        rewardId: selectedRewardId,
      });
      onClose();
      setSelectedRewardId(""); // Reset selection
    } catch {
      // Error handled in hook
    }
  };

  if (!client) return null;

  const canAfford = selectedReward
    ? client.currentPoints >= selectedReward.pointsCost
    : true;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            Canjear Puntos
          </DialogTitle>
          <DialogDescription>
            Selecciona un premio para canjear los puntos de {client.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Client Info Card */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Puntos Disponibles
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="text-xl font-bold text-gray-900">
                  {client.currentPoints}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-mono">{client.dni}</p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="reward">Seleccionar Premio</Label>
            <Select
              value={selectedRewardId}
              onValueChange={setSelectedRewardId}
              disabled={isLoadingRewards}
            >
              <SelectTrigger id="reward">
                <SelectValue placeholder="Elige un premio..." />
              </SelectTrigger>
              <SelectContent>
                {rewards.map((reward) => (
                  <SelectItem
                    key={reward._id}
                    value={reward._id}
                    disabled={
                      client.currentPoints < reward.pointsCost ||
                      (reward.stock !== null && reward.stock <= 0)
                    }
                    className="flex justify-between w-full"
                  >
                    <span>{reward.name}</span>
                    <span className="ml-2 text-primary font-bold">
                      {reward.pointsCost} pts
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedReward && (
              <div className="mt-2 text-sm">
                {!canAfford ? (
                  <p className="text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Insuficientes puntos. Faltan{" "}
                    {selectedReward.pointsCost - client.currentPoints}.
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Puntos restantes:{" "}
                    <span className="font-bold text-gray-900">
                      {client.currentPoints - selectedReward.pointsCost}
                    </span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isRedeeming}>
            Cancelar
          </Button>
          <Button
            onClick={handleRedeem}
            disabled={
              !selectedRewardId ||
              isRedeeming ||
              !canAfford ||
              (selectedReward?.stock !== null &&
                selectedReward?.stock !== undefined &&
                selectedReward.stock <= 0)
            }
          >
            {isRedeeming ? "Canjeando..." : "Confirmar Canje"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
