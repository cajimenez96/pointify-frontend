"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/auth-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Schema de validación
const tenantLoginSchema = z.object({
  companyCode: z
    .string()
    .min(3, "El código de empresa debe tener al menos 3 caracteres"),
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type TenantLoginForm = z.infer<typeof tenantLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const loginTenant = useAuthStore((state) => state.loginTenant);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantLoginForm>({
    resolver: zodResolver(tenantLoginSchema),
  });

  const onSubmit = async (data: TenantLoginForm) => {
    setIsLoading(true);

    try {
      await loginTenant(data.companyCode, data.username, data.password);

      toast.success("¡Bienvenido!");
      router.push("/admin/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Credenciales inválidas. Verifica los datos ingresados.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Pointify</h1>
          <p className="text-gray-600">Panel de Administración</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Company Code */}
          <div className="space-y-2">
            <Label htmlFor="companyCode">Código de Empresa</Label>
            <Input
              id="companyCode"
              type="text"
              placeholder="DEFAULT"
              {...register("companyCode")}
              disabled={isLoading}
              autoFocus
            />
            {errors.companyCode && (
              <p className="text-sm text-red-600">
                {errors.companyCode.message}
              </p>
            )}
          </div>

          {/* Username / DNI */}
          <div className="space-y-2">
            <Label htmlFor="username">Usuario / DNI</Label>
            <Input
              id="username"
              type="text"
              placeholder="juan.perez"
              {...register("username")}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Iniciando sesión...
              </span>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Volver al inicio
          </Link>
        </div>
      </Card>
    </div>
  );
}
