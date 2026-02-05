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
import apiClient from "@/lib/api-client";

// Schema de login
const loginSchema = z.object({
  companyCode: z.string().min(3, "Código de empresa requerido"),
  username: z.string().min(3, "Usuario requerido"),
  password: z.string().min(6, "Contraseña requerida"),
});

type LoginForm = z.infer<typeof loginSchema>;

// Schema de transacción
const transactionSchema = z.object({
  dni: z.string().min(7, "DNI inválido"),
  saleCode: z.string().min(1, "Código de venta requerido"),
});

type TransactionForm = z.infer<typeof transactionSchema>;

export default function POSPage() {
  const { user, loginTenant, logout } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<any>(null);

  // Formulario de login
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // Formulario de transacción
  const {
    register: registerTransaction,
    handleSubmit: handleSubmitTransaction,
    formState: { errors: transactionErrors },
    reset: resetTransaction,
  } = useForm<TransactionForm>({
    resolver: zodResolver(transactionSchema),
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

  // Manejo de transacción
  const onAddPoints = async (data: TransactionForm) => {
    setIsProcessing(true);
    setResult(null);

    try {
      const response = await apiClient.post("/transactions/add", {
        dni: data.dni,
        saleCode: data.saleCode,
      });

      setResult(response.data);
      resetTransaction();

      toast.success(response.data.message || "Puntos agregados exitosamente");
    } catch (error: any) {
      // El interceptor ya muestra el toast de error
      console.error("Error en transacción:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Vista de Login
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4">
        <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">🛒</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Punto de Venta</h1>
            <p className="text-gray-600">Ingresa para cargar puntos</p>
          </div>

          {/* Formulario de Login */}
          <form onSubmit={handleSubmitLogin(onLogin)} className="space-y-4">
            {/* Company Code */}
            <div className="space-y-2">
              <Label htmlFor="companyCode">Código de Empresa</Label>
              <Input
                id="companyCode"
                type="text"
                placeholder="DEFAULT"
                {...registerLogin("companyCode")}
                disabled={isLoggingIn}
                autoFocus
              />
              {loginErrors.companyCode && (
                <p className="text-sm text-red-600">
                  {loginErrors.companyCode.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Usuario / DNI</Label>
              <Input
                id="username"
                type="text"
                placeholder="Ej: 87654321"
                {...registerLogin("username")}
                disabled={isLoggingIn}
              />
              {loginErrors.username && (
                <p className="text-sm text-red-600">
                  {loginErrors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...registerLogin("password")}
                disabled={isLoggingIn}
              />
              {loginErrors.password && (
                <p className="text-sm text-red-600">
                  {loginErrors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  // Vista POS (Autenticado)
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <Card className="w-full max-w-2xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Punto de Venta</h1>
            <p className="text-gray-600">
              {user.role === "cashier" ? "Cajero" : "Administrador"}:{" "}
              {user.name || user.username}
            </p>
            <p className="text-sm text-gray-500">
              Empresa: {user.companyName || user.companyCode}
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>

        {/* Formulario de Transacción */}
        <form
          onSubmit={handleSubmitTransaction(onAddPoints)}
          className="space-y-6"
        >
          {/* DNI del Cliente */}
          <div className="space-y-2">
            <Label htmlFor="dni" className="text-lg">
              DNI del Cliente
            </Label>
            <Input
              id="dni"
              type="text"
              placeholder="Ej: 11223344"
              className="h-14 text-xl"
              {...registerTransaction("dni")}
              disabled={isProcessing}
              autoFocus
            />
            {transactionErrors.dni && (
              <p className="text-sm text-red-600">
                {transactionErrors.dni.message}
              </p>
            )}
          </div>

          {/* Código de Venta */}
          <div className="space-y-2">
            <Label htmlFor="saleCode" className="text-lg">
              Código de Venta
            </Label>
            <Input
              id="saleCode"
              type="text"
              placeholder="Ej: SALE001"
              className="h-14 text-xl"
              {...registerTransaction("saleCode")}
              disabled={isProcessing}
            />
            {transactionErrors.saleCode && (
              <p className="text-sm text-red-600">
                {transactionErrors.saleCode.message}
              </p>
            )}
          </div>

          {/* Resultado */}
          {result && (
            <div
              className={`border px-4 py-3 rounded ${
                result.rewardReached
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              <p className="font-bold text-lg">{result.message}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p>Cliente: {result.client.name || result.client.dni}</p>
                <p>Puntos actuales: {result.client.currentPoints}</p>
                <p>Total acumulado: {result.client.totalAccumulated}</p>
                {result.client.status === "PENDING" && (
                  <p className="text-orange-600 font-semibold">
                    ⚠️ Cliente pendiente de completar registro
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Botón Submit */}
          <Button
            type="submit"
            className="w-full h-14 text-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
            disabled={isProcessing}
          >
            {isProcessing ? "Procesando..." : "Agregar Puntos"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
