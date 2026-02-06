/**
 * PointsHeader Component
 * Header showing client balance and company info
 */

"use client";

import { Wallet, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PointsHeaderProps {
  clientName: string | null;
  currentPoints: number;
  companyName: string;
  status: "ACTIVE" | "PENDING";
}

export function PointsHeader({
  clientName,
  currentPoints,
  companyName,
  status,
}: PointsHeaderProps) {
  return (
    <Card className="p-6 border-violet-700 bg-gradient-to-r from-violet-900/30 to-purple-900/30 backdrop-blur">
      {/* Company Info */}
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="h-5 w-5 text-slate-400" />
        <span className="text-slate-300 text-sm">{companyName}</span>
      </div>

      {/* Client Greeting */}
      <div className="mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          {clientName ? `Hola, ${clientName}` : "Hola!"}
        </h1>
        {status === "PENDING" && (
          <p className="text-yellow-400 text-sm">
            ⚠️ Completa tu perfil para obtener beneficios adicionales
          </p>
        )}
      </div>

      {/* Points Display */}
      <div className="flex items-center gap-3">
        <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
          <Wallet className="h-7 w-7 text-white" />
        </div>
        <div>
          <p className="text-slate-400 text-sm">Tienes</p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl md:text-5xl font-bold text-green-400">
              {currentPoints}
            </span>
            <span className="text-xl text-slate-300">puntos</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
