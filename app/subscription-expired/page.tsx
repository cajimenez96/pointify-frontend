"use client";

import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SubscriptionExpiredPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-lg p-8 space-y-6 text-center shadow-2xl border-red-200">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-600 rounded-full mx-auto flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Suscripción Expirada
          </h1>
          <p className="text-lg text-gray-700">
            El servicio de esta empresa ha vencido
          </p>
        </div>

        {/* Content */}
        <div className="space-y-4 text-gray-600">
          <p>
            La suscripción de tu empresa ha caducado y el acceso a Pointify está
            temporalmente suspendido.
          </p>
          <p className="text-sm">
            Por favor, contacta al administrador de la empresa o al equipo de
            soporte de Pointify para renovar tu suscripción.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => {
              localStorage.removeItem("pointify-auth-storage");
              router.push("/");
            }}
            className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
          >
            Volver al Inicio
          </Button>

          <p className="text-sm text-gray-500">
            ¿Necesitas ayuda? Contacta a{" "}
            <a
              href="mailto:soporte@pointify.com"
              className="text-blue-600 hover:underline"
            >
              soporte@pointify.com
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
