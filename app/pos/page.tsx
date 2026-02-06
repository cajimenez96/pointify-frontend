/**
 * POS Page - Redesigned with Dual Mode
 * EARN mode: Add points to clients
 * REDEEM mode: Exchange points for rewards
 */

"use client";

import { useState } from "react";
import { useAuthStore } from "@/lib/auth-store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Gift, LogOut, Store, QrCode } from "lucide-react";
import { CompanyQR } from "@/components/shared/CompanyQR";
import { EarnTab } from "./components/EarnTab";
import { RedeemTab } from "./components/RedeemTab";

// Schema de login
const loginSchema = z.object({
  companyCode: z.string().min(3, "Código de empresa requerido"),
  username: z.string().min(3, "Usuario requerido"),
  password: z.string().min(6, "Contraseña requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function POSPage() {
  const { user, loginTenant, logout } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Formulario de login
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Manejo de login
  const onLogin = async (data: LoginForm) => {
    setIsLoggingIn(true);

    try {
      await loginTenant(data.companyCode, data.username, data.password);
      toast.success("Sesión iniciada correctamente");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Error al iniciar sesión. Verifica tus credenciales.";

      toast.error(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Vista de Login
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
        <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl border-slate-700 bg-slate-900/90">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full mx-auto flex items-center justify-center">
              <Store className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Punto de Venta</h1>
            <p className="text-slate-400">Inicia sesión para continuar</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
            <div>
              <Label htmlFor="companyCode" className="text-slate-300">
                Código de Empresa
              </Label>
              <Input
                id="companyCode"
                {...register("companyCode")}
                placeholder="ABC123"
                className="mt-1 bg-slate-800 border-slate-700 text-white"
                disabled={isLoggingIn}
              />
              {errors.companyCode && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.companyCode.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="username" className="text-slate-300">
                Usuario
              </Label>
              <Input
                id="username"
                {...register("username")}
                placeholder="Usuario"
                className="mt-1 bg-slate-800 border-slate-700 text-white"
                disabled={isLoggingIn}
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-slate-300">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                {...register("password")}
                placeholder="******"
                className="mt-1 bg-slate-800 border-slate-700 text-white"
                disabled={isLoggingIn}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoggingIn}
              className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
            >
              {isLoggingIn ? "Iniciando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Vista Principal (Autenticado)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <Card className="p-4 border-slate-700 bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Punto de Venta
                </h1>
                <p className="text-slate-400 text-sm">
                  Usuario: <span className="text-white">{user.username}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-slate-300 hover:text-white hover:bg-slate-800"
                    title="Ver QR Cliente"
                  >
                    <QrCode className="h-6 w-6" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white text-slate-900 border-none">
                  <CompanyQR
                    companyCode={user.companyCode || ""}
                    companyName={user.companyName || "Tu Empresa"}
                  />
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  toast.info("Sesión cerrada");
                }}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </Card>
      </header>

      {/* Main Content - Tabs */}
      <div className="max-w-5xl mx-auto">
        <Tabs defaultValue="earn" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-800 border border-slate-700">
            <TabsTrigger
              value="earn"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Sumar Puntos
            </TabsTrigger>
            <TabsTrigger
              value="redeem"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Gift className="h-5 w-5 mr-2" />
              Canjear Premio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="earn">
            <EarnTab />
          </TabsContent>

          <TabsContent value="redeem">
            <RedeemTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
