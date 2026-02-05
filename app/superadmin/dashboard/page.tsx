"use client";

import { Card } from "@/components/ui/card";

export default function SuperAdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Global</h1>
        <p className="text-slate-400">Vista general del sistema multi-tenant</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Empresas"
          value="0"
          icon="🏢"
          color="from-blue-600 to-cyan-600"
        />
        <StatCard
          title="Total Usuarios"
          value="0"
          icon="👥"
          color="from-purple-600 to-pink-600"
        />
        <StatCard
          title="Empresas Activas"
          value="0"
          icon="✅"
          color="from-green-600 to-emerald-600"
        />
      </div>

      {/* Info Card */}
      <Card className="bg-slate-800 border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Panel de Superadministración
        </h2>
        <p className="text-slate-300 mb-4">
          Desde este panel puedes gestionar todas las empresas y usuarios del
          sistema Pointify.
        </p>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Crear y administrar
            empresas
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Gestionar usuarios de cada
            empresa
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-400">✓</span> Configurar límites y
            suscripciones
          </li>
        </ul>
      </Card>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <Card className="bg-slate-800 border-slate-700 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div
          className={`w-14 h-14 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-2xl`}
        >
          {icon}
        </div>
      </div>
    </Card>
  );
}
