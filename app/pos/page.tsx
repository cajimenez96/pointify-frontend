/**
 * POS Page - Dual Mode (Login / Authenticated)
 * EARN mode: Add points to clients
 * REDEEM mode: Exchange points for rewards
 */

"use client";

import { useAuthStore } from "@/lib/auth-store";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Gift, LogOut, Store, QrCode } from "lucide-react";
import { CompanyQR } from "@/components/shared/CompanyQR";
import { EarnTab } from "./components/EarnTab";
import { RedeemTab } from "./components/RedeemTab";
import { LoginForm } from "@/components/shared/LoginForm";
import { tenantLoginSchema } from "@/repositories/auth/schemas";
import type { TenantLoginForm } from "@/repositories/auth/schemas";
import { useLoginPOSMutation } from "./hooks/useLoginPOS";

export default function POSPage() {
  const { user, logout } = useAuthStore();
  const loginMutation = useLoginPOSMutation();

  // Vista de Login
  if (!user) {
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
        onSubmit={(data) => loginMutation.mutate(data)}
        isSubmitting={loginMutation.isPending}
        icon={<Store className="h-7 w-7 text-primary" />}
        title="Punto de Venta"
        subtitle="Inicia sesión para continuar"
      />
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
