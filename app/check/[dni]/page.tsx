/**
 * Public Client View Page
 * Accessed via QR code with companyCode param
 * Shows client balance and available rewards (NO AUTH required)
 */

"use client";

import { use } from "react";
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

  const { data: clientData, isLoading, error, refetch } = useClientPublic(dni, companyCode);

  // Error: Missing companyCode
  if (!companyCode) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md p-8 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            Código de Empresa Requerido
          </h1>
          <p className="text-muted-foreground mb-4">
            El enlace QR debe incluir el código de la empresa.
          </p>
          <p className="text-sm text-muted-foreground">
            Formato correcto: /check/{"{dni}"}?companyCode=ABC123
          </p>
        </Card>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground text-lg">
            Cargando tu información...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !clientData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <Card className="max-w-md p-8 text-center">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error al Cargar Datos</h1>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error
              ? error.message
              : "No se pudo cargar la información del cliente"}
          </p>
          <p className="text-sm text-muted-foreground">
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
        onSuccess={() => refetch()}
      />
    );
  }

  // Success: Show client data
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header with QR icon */}
      <div className="mb-6 flex items-center justify-center gap-2 text-muted-foreground">
        <QrCode className="h-5 w-5" />
        <span className="text-sm">Vista Pública</span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Points Header */}
        <PointsHeader
          clientName={clientData.name}
          currentPoints={clientData.currentPoints}
          companyName={clientData.company?.businessName || "Tu Empresa"}
          status={clientData.status}
        />

        {/* Rewards Catalog */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Catálogo de Premios</h2>
          <RewardsCatalog rewards={clientData.rewards} />
        </div>

        {/* Footer Info */}
        <Card className="p-6 text-center">
          <p className="text-muted-foreground text-sm mb-2">
            Para canjear tus premios, muestra tu DNI en cualquiera de nuestros
            puntos de venta
          </p>
          <p className="text-muted-foreground text-xs">DNI: {clientData.dni}</p>
        </Card>
      </div>
    </div>
  );
}
