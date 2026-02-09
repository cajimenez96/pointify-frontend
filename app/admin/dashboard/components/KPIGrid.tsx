/**
 * KPIGrid - Key Performance Indicators cards
 */

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardStats } from "@/repositories/admin/dashboard/types";
import type { Settings } from "@/repositories/admin/settings/types";

interface KPIGridProps {
  stats: DashboardStats;
  settings: Settings;
  activeClients: number;
  shadowClients: number;
  conversionRate: number;
  totalClients: number;
}

export function KPIGrid({
  stats,
  settings,
  activeClients,
  shadowClients,
  conversionRate,
  totalClients,
}: KPIGridProps) {
  const activeReward = settings.rewards?.find((r) => r.isActive);
  const stockIsUnlimited = activeReward?.stock === null;
  const stockUsed = 0; // TODO: track redeemed count when backend supports it
  const stockTotal = activeReward?.stock ?? 0;
  const stockPercentage = stockTotal > 0 ? (stockUsed / stockTotal) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Stock de Premios */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Stock de Premios
        </h3>
        {stockIsUnlimited ? (
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {activeReward?.name || "-"}
            </p>
            <p className="text-sm text-green-600 mt-1">Ilimitados</p>
          </div>
        ) : (
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-gray-900">{stockUsed}</p>
              <p className="text-xl text-gray-500">/ {stockTotal}</p>
            </div>
            <Progress value={stockPercentage} className="mt-3" />
            <p className="text-sm text-gray-600 mt-2">
              {stockPercentage >= 100 ? (
                <span className="text-red-600 font-semibold">
                  Stock agotado
                </span>
              ) : stockPercentage >= 80 ? (
                <span className="text-orange-600 font-semibold">
                  Stock bajo
                </span>
              ) : (
                `${(100 - stockPercentage).toFixed(0)}% disponible`
              )}
            </p>
          </div>
        )}
      </Card>

      {/* Conversión de Usuarios */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Conversión de Usuarios
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {conversionRate.toFixed(0)}%
        </p>
        <div className="mt-3 space-y-1 text-sm">
          <p className="text-green-600">Activos: {activeClients}</p>
          <p className="text-yellow-600">Pendientes: {shadowClients}</p>
        </div>
      </Card>

      {/* Total de Transacciones */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Total Transacciones
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {stats.totalTransactions}
        </p>
        <p className="text-sm text-gray-600 mt-3">
          Promedio:{" "}
          {stats.totalTransactions && totalClients > 0
            ? (stats.totalTransactions / totalClients).toFixed(1)
            : 0}{" "}
          por cliente
        </p>
      </Card>

      {/* Puntos Emitidos */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-gray-600 mb-2">
          Puntos Emitidos
        </h3>
        <p className="text-3xl font-bold text-gray-900">
          {stats.totalPointsIssued}
        </p>
        <p className="text-sm text-gray-600 mt-3">
          Total acumulado del sistema
        </p>
      </Card>
    </div>
  );
}
