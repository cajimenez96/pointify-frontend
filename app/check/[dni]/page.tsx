/**
 * Public Client View Page
 * Accessed via QR code with companyCode param
 * Shows client balance and available rewards (NO AUTH required)
 */

"use client";

import { useEffect, use } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AlertCircle, QrCode } from "lucide-react";
import { useClientPublic } from "../hooks/useClientPublic";
import { PointsHeader } from "./components/PointsHeader";
import { RewardsCatalog } from "./components/RewardsCatalog";

import { ClientRegistrationForm } from "./components/ClientRegistrationForm";

interface PageProps {
  params: Promise<{
    dni: string;
  }>;
}

export default function ClientPublicPage({ params }: PageProps) {
  const { dni } = use(params);
  const searchParams = useSearchParams();
  const companyCode = searchParams.get("companyCode");

  const { clientData, isLoading, error, fetchClient } = useClientPublic();

  useEffect(() => {
    if (dni && companyCode) {
      fetchClient(dni, companyCode);
    }
  }, [dni, companyCode, fetchClient]);

  // Error: Missing companyCode
  if (!companyCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="max-w-md p-8 text-center border-red-700 bg-slate-900/90">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Código de Empresa Requerido
          </h1>
          <p className="text-slate-400 mb-4">
            El enlace QR debe incluir el código de la empresa.
          </p>
          <p className="text-sm text-slate-500">
            Formato correcto: /check/{dni}?companyCode=ABC123
          </p>
        </Card>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="inline-block h-16 w-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-white text-lg">Cargando tu información...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !clientData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="max-w-md p-8 text-center border-red-700 bg-slate-900/90">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">
            Error al Cargar Datos
          </h1>
          <p className="text-slate-400 mb-4">
            {error || "No se pudo cargar la información del cliente"}
          </p>
          <p className="text-sm text-slate-500">
            Verifica el DNI y el código de empresa
          </p>
        </Card>
      </div>
    );
  }

  // PENDING State: Show Registration Form
  if (clientData.status === "PENDING") {
    return (
      <ClientRegistrationForm
        dni={dni}
        companyCode={companyCode}
        onSuccess={() => fetchClient(dni, companyCode)}
      />
    );
  }

  // Success: Show client data
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header with QR icon */}
      <div className="mb-6 flex items-center justify-center gap-2 text-slate-500">
        <QrCode className="h-5 w-5" />
        <span className="text-sm">Vista Pública</span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Points Header */}
        <PointsHeader
          clientName={clientData.name}
          currentPoints={clientData.currentPoints}
          companyName={clientData.companyInfo?.businessName || "Tu Empresa"}
          status={clientData.status}
        />

        {/* Rewards Catalog */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Catálogo de Premios
          </h2>
          <RewardsCatalog rewards={clientData.rewards} />
        </div>

        {/* Footer Info */}
        <Card className="p-6 border-slate-700 bg-slate-800/50 text-center">
          <p className="text-slate-400 text-sm mb-2">
            Para canjear tus premios, muestra tu DNI en cualquiera de nuestros
            puntos de venta
          </p>
          <p className="text-slate-500 text-xs">DNI: {clientData.dni}</p>
        </Card>
      </div>
    </div>
  );
}
