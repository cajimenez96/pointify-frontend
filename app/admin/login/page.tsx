"use client";

import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { LoginForm } from "@/components/shared/LoginForm";
import { tenantLoginSchema } from "@/repositories/auth/schemas";
import type { TenantLoginForm } from "@/repositories/auth/schemas";
import { useLoginAdminMutation } from "./hooks/useLoginAdmin";

export default function AdminLoginPage() {
  const loginMutation = useLoginAdminMutation();

  return (
    <LoginForm<TenantLoginForm>
      schema={tenantLoginSchema}
      fields={[
        {
          name: "companyCode",
          label: "Código de Empresa",
          placeholder: "Código de empresa",
          autoFocus: true,
        },
        {
          name: "username",
          label: "Usuario / DNI",
          placeholder: "Usuario",
        },
        {
          name: "password",
          label: "Contraseña",
          type: "password",
          placeholder: "Contraseña",
        },
      ]}
      onSubmit={(data) => loginMutation.mutate(data)}
      isSubmitting={loginMutation.isPending}
      icon={<BarChart3 className="h-7 w-7 text-primary" />}
      title="Pointify"
      subtitle="Panel de Administración"
      footer={
        <Link href="/" className="text-primary hover:underline">
          &larr; Volver al inicio
        </Link>
      }
    />
  );
}
