"use client";

import { Card } from "@/components/ui/card";
import { useDashboardData } from "./hooks/useDashboardData";
import { CampaignStatus } from "./components/CampaignStatus";
import { CompanyQRCard } from "./components/CompanyQRCard";
import { KPIGrid } from "./components/KPIGrid";
import { ClientSummary } from "./components/ClientSummary";

export default function AdminDashboard() {
  const {
    stats,
    settings,
    clients,
    activeClients,
    shadowClients,
    conversionRate,
    isLoading,
    error,
  } = useDashboardData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitoreo en tiempo real de tu campaña de lealtad
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto" />
            <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Card className="bg-red-50 border-red-200 p-6">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-red-700 font-semibold mb-1">
                Error al cargar estadísticas
              </h3>
              <p className="text-red-600 text-sm">
                {error instanceof Error ? error.message : "Error desconocido"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Dashboard Content */}
      {stats && settings && !isLoading && (
        <>
          {/* Campaign Status + QR */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CampaignStatus settings={settings} />
            <CompanyQRCard />
          </div>

          {/* KPI Grid */}
          <KPIGrid
            stats={stats}
            settings={settings}
            activeClients={activeClients}
            shadowClients={shadowClients}
            conversionRate={conversionRate}
            totalClients={clients.length}
          />

          {/* Client Summary */}
          <ClientSummary
            totalClients={clients.length}
            activeClients={activeClients}
            shadowClients={shadowClients}
          />
        </>
      )}
    </div>
  );
}
