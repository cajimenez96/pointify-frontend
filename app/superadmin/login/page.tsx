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

// Schema de validación
const superAdminLoginSchema = z.object({
  username: z.string().min(3, "El usuario debe tener al menos 3 caracteres"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SuperAdminLoginForm = z.infer<typeof superAdminLoginSchema>;

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const loginSuperAdmin = useAuthStore((state) => state.loginSuperAdmin);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SuperAdminLoginForm>({
    resolver: zodResolver(superAdminLoginSchema),
  });

  const onSubmit = async (data: SuperAdminLoginForm) => {
    setIsLoading(true);

    try {
      await loginSuperAdmin(data.username, data.password);

      toast.success("Bienvenido, SuperAdmin");
      router.push("/superadmin/dashboard");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Credenciales inválidas. Verifica tu usuario y contraseña.";

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl border-slate-700">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl mx-auto flex items-center justify-center mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Pointify</h1>
          <p className="text-slate-400">Panel de SuperAdmin</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-slate-200">
              Usuario
            </Label>
            <Input
              id="username"
              type="text"
              placeholder="superadmin"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              {...register("username")}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-red-400">{errors.username.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-200">
              Contraseña
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-800 border-slate-600 text-white placeholder:text-slate-500"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 text-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
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
        <div className="text-center text-sm text-slate-500">
          <p>Acceso exclusivo para administradores del sistema</p>
        </div>
      </Card>
    </div>
  );
}
