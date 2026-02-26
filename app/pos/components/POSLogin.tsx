"use client";

import { Store } from "lucide-react";
import { LoginForm } from "@/components/shared/LoginForm";
import { tenantLoginSchema } from "@/repositories/auth/schemas";
import type { TenantLoginForm } from "@/repositories/auth/schemas";

interface POSLoginProps {
  onLogin: (data: TenantLoginForm) => void;
  isSubmitting: boolean;
}

export function POSLogin({ onLogin, isSubmitting }: POSLoginProps) {
  return (
    <LoginForm<TenantLoginForm>
      schema={tenantLoginSchema}
      fields={[
        {
          name: "companyCode",
          label: "Código de Empresa",
          placeholder: "Código de empresa",
        },
        {
          name: "username",
          label: "Usuario",
          placeholder: "Usuario",
        },
        {
          name: "password",
          label: "Contraseña",
          type: "password",
          placeholder: "Contraseña",
        },
      ]}
      onSubmit={onLogin}
      isSubmitting={isSubmitting}
      icon={<Store className="h-7 w-7 text-primary" />}
      title="Punto de Venta"
      subtitle="Inicia sesión para continuar"
    />
  );
}
