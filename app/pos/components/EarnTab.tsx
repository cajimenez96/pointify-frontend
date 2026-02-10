/**
 * EarnTab Component
 * Tab for adding points to clients (EARN operation)
 */

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, TrendingUp } from "lucide-react";
import { useEarnPoints } from "../hooks/useEarnPoints";
import { useProducts } from "@/app/admin/settings/hooks/useProducts";
import { ClientSearchCard } from "./ClientSearchCard";
import { earnPointsSchema, type EarnPointsForm } from "../schemas";
import type { ClientSummary } from "@/repositories/transactions/types";

export function EarnTab() {
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(
    null,
  );
  const [previewPoints, setPreviewPoints] = useState(0);

  const earnMutation = useEarnPoints();
  const { products, isLoading: loadingProducts } = useProducts();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<EarnPointsForm>({
    resolver: zodResolver(earnPointsSchema),
  });

  const selectedProductName = watch("productName");

  // Update preview when product changes
  useEffect(() => {
    if (selectedProductName) {
      const product = products.find(
        (p) => p.productName === selectedProductName,
      );
      setPreviewPoints(product?.pointsValue || 0);
    } else {
      setPreviewPoints(0);
    }
  }, [selectedProductName, products]);

  const onSubmit = async (data: EarnPointsForm) => {
    if (!selectedClient) return;

    try {
      await earnMutation.mutateAsync({
        dni: data.dni,
        saleCode: data.saleCode,
        productName: data.productName,
      });

      // Reset form and client search
      reset();
      setSelectedClient(null);
      setPreviewPoints(0);
    } catch (error) {
      // Error is handled in hook with toast
    }
  };

  const handleClientFound = (client: ClientSummary) => {
    setSelectedClient(client);
    setValue("dni", client.dni);
  };

  // Mock search function - in real implementation, this would fetch from backend
  const mockSearchClient = async (dni: string): Promise<ClientSummary> => {
    // This is a placeholder - the actual search would happen in the EARN mutation
    // which creates shadow users automatically
    return {
      dni,
      name: `Cliente ${dni}`,
      status: "PENDING",
      currentPoints: 0,
      totalAccumulated: 0,
    };
  };

  return (
    <div className="space-y-6">
      {/* Client Search */}
      <ClientSearchCard
        onClientFound={handleClientFound}
        onSearchDni={mockSearchClient}
        isLoading={earnMutation.isPending}
      />

      {/* Sale Form - Only shown when client is selected */}
      {selectedClient && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6 border-slate-700 bg-slate-800/50">
            <h3 className="text-lg font-semibold text-white mb-4">
              Registrar Venta
            </h3>

            <div className="space-y-4">
              {/* Sale Code */}
              <div>
                <Label htmlFor="saleCode" className="text-slate-300">
                  Código de Venta
                </Label>
                <Input
                  id="saleCode"
                  {...register("saleCode")}
                  placeholder="ej: SALE-2026-001"
                  className="mt-1 bg-slate-900 border-slate-600 text-white"
                  disabled={earnMutation.isPending}
                />
                {errors.saleCode && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.saleCode.message}
                  </p>
                )}
              </div>

              {/* Product Selection */}
              <div>
                <Label htmlFor="productName" className="text-slate-300">
                  Producto
                </Label>
                <Select
                  onValueChange={(value) => setValue("productName", value)}
                  disabled={earnMutation.isPending || loadingProducts}
                >
                  <SelectTrigger className="mt-1 bg-slate-900 border-slate-600 text-white">
                    <SelectValue placeholder="Seleccionar producto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem
                        key={product.productName}
                        value={product.productName}
                      >
                        {product.productName} (+{product.pointsValue} pts)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.productName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.productName.message}
                  </p>
                )}
              </div>
            </div>
          </Card>

          {/* Preview */}
          {previewPoints > 0 && (
            <Card className="p-4 border-green-700 bg-green-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Puntos a sumar:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <span className="text-2xl font-bold text-green-400">
                      +{previewPoints}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Nuevo saldo:</p>
                  <span className="text-xl font-semibold text-white">
                    {selectedClient.currentPoints + previewPoints} puntos
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={earnMutation.isPending || !selectedClient || previewPoints === 0}
            className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            {earnMutation.isPending ? "Registrando..." : "Registrar Venta"}
          </Button>
        </form>
      )}
    </div>
  );
}
