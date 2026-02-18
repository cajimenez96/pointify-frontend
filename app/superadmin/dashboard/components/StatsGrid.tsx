import type { DashboardStats } from "@/repositories/superadmin/dashboard/types";
import { StatCard } from "./StatCard";

interface StatsGridProps {
  stats: DashboardStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Companies */}
      <StatCard
        title="Total Empresas"
        value={stats.totalCompanies.toLocaleString()}
        icon="🏢"
        color="from-violet-600 to-purple-600"
        subtitle={`${stats.activeCompanies} activas · ${stats.inactiveCompanies} inactivas`}
      />

      <StatCard
        title="Nuevas Este Mes"
        value={stats.newCompaniesThisMonth.toLocaleString()}
        icon="✨"
        color="from-blue-600 to-cyan-600"
        subtitle="Empresas registradas"
      />

      {/* Users */}
      <StatCard
        title="Total Usuarios"
        value={stats.totalUsers.toLocaleString()}
        icon="👥"
        color="from-purple-600 to-pink-600"
        subtitle={`${stats.usersByRole.admin} admins · ${stats.usersByRole.cashier} cajeros`}
      />

      {/* Clients */}
      <StatCard
        title="Total Clientes"
        value={stats.totalClients.toLocaleString()}
        icon="👤"
        color="from-green-600 to-emerald-600"
        subtitle={`${stats.newClientsThisMonth} nuevos este mes`}
      />

      {/* Transactions */}
      <StatCard
        title="Transacciones"
        value={stats.totalTransactions.toLocaleString()}
        icon="💳"
        color="from-orange-600 to-red-600"
        subtitle={`${stats.transactionsByType.earn} earn · ${stats.transactionsByType.redeem} redeem`}
      />

      {/* Points Economy */}
      <StatCard
        title="Puntos en Circulación"
        value={(
          stats.totalPointsIssued - stats.totalPointsRedeemed
        ).toLocaleString()}
        icon="⭐"
        color="from-yellow-600 to-amber-600"
        subtitle={`${stats.totalPointsIssued.toLocaleString()} emitidos · ${stats.totalPointsRedeemed.toLocaleString()} canjeados`}
      />
    </div>
  );
}
