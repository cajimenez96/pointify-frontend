/**
 * Client Registration Form
 * Displayed when a client status is PENDING
 */

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserPlus, Sparkles } from "lucide-react";
import { useClientRegister } from "../../hooks/useClientRegister";

const registerSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
});

type RegisterForm = z.infer<typeof registerSchema>;

interface ClientRegistrationFormProps {
  dni: string;
  companyCode: string;
  onSuccess: () => void; // Reload client data after success
}

export function ClientRegistrationForm({
  dni,
  companyCode,
  onSuccess,
}: ClientRegistrationFormProps) {
  const { registerClient, isRegistering } = useClientRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    const success = await registerClient({
      dni,
      companyCode,
      ...data,
    });

    if (success) {
      onSuccess();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl border-slate-700 bg-slate-900/90 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 to-purple-600" />

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto flex items-center justify-center border border-slate-700">
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">¡Casi terminamos!</h1>
          <p className="text-slate-400">
            Completa tus datos para activar tu cuenta y empezar a sumar puntos
            con el DNI <span className="text-white font-mono">{dni}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-300">
              Nombre Completo
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Juan Pérez"
              className="bg-slate-800 border-slate-600 text-white"
            />
            {errors.name && (
              <p className="text-red-400 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="juan@email.com"
              className="bg-slate-800 border-slate-600 text-white"
            />
            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-slate-300">
              Teléfono
            </Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="Ej: 999 888 777"
              className="bg-slate-800 border-slate-600 text-white"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isRegistering}
            className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold text-lg"
          >
            {isRegistering ? "Registrando..." : "Activar Cuenta"}
            {!isRegistering && <UserPlus className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </Card>
    </div>
  );
}
