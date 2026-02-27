"use client";

import { Lock } from "lucide-react";
import { LoginForm } from "@/components/shared/LoginForm";
import { superAdminLoginSchema } from "@/repositories/auth/schemas";
import type { SuperAdminLoginForm } from "@/repositories/auth/schemas";
import { useLoginSuperAdminMutation } from "./hooks/useLoginSuperAdmin";

export default function SuperAdminLoginPage() {
  const loginMutation = useLoginSuperAdminMutation();

  return (
    <LoginForm<SuperAdminLoginForm>
      schema={superAdminLoginSchema}
      fields={[
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
      onSubmit={(data) => loginMutation.mutate(data)}
      isSubmitting={loginMutation.isPending}
      icon={<Lock className="h-7 w-7 text-primary" />}
      title="Pointify"
      subtitle="Panel de SuperAdmin"
      footer={<p>Acceso exclusivo para administradores del sistema</p>}
    />
  );
}
