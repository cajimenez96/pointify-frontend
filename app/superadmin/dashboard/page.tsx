"use client";

import { useDashboardStats } from "./hooks/useDashboardStats";
import { StatsGrid } from "./components/StatsGrid";
import { TopCompaniesSection } from "./components/TopCompaniesSection";
import { ExpiringSubscriptionsSection } from "./components/ExpiringSubscriptionsSection";
import { Card } from "@/components/ui/card";

export default function SuperAdminDashboardPage() {
  const { data: stats, isLoading, error } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Global</h1>
        <p className="text-muted-foreground">Vista general del sistema multi-tenant</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="bg-red-50 border-red-200 p-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-red-600 font-semibold mb-1">
                Error al cargar estadísticas
              </h3>
              <p className="text-red-500 text-sm">
                {error instanceof Error ? error.message : "Error desconocido"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Content */}
      {stats && !isLoading && (
        <>
          {/* Main Stats Grid */}
          <StatsGrid stats={stats} />

          {/* Top Companies Rankings */}
          <TopCompaniesSection
            topByClients={stats.topCompaniesByClients}
            topByTransactions={stats.topCompaniesByTransactions}
          />

          {/* Expiring Subscriptions Alert */}
          <ExpiringSubscriptionsSection
            subscriptions={stats.expiringSubscriptions}
          />
        </>
      )}
    </div>
  );
}
