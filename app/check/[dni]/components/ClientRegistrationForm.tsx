/**
 * Client Registration Form
 * Displayed when a client status is PENDING
 */

"use client";

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
  onSuccess: () => void;
}

export function ClientRegistrationForm({
  dni,
  companyCode,
  onSuccess,
}: ClientRegistrationFormProps) {
  const registerMutation = useClientRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    await registerMutation.mutateAsync({
      dni,
      companyCode,
      ...data,
    });
    onSuccess();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-600 to-purple-600" />

        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center border">
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold">Casi terminamos!</h1>
          <p className="text-muted-foreground">
            Completa tus datos para activar tu cuenta y empezar a sumar puntos
            con el DNI <span className="font-mono font-semibold">{dni}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Ej: Juan Pérez"
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="juan@email.com"
            />
            {errors.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
              placeholder="Ej: 999 888 777"
            />
            {errors.phone && (
              <p className="text-destructive text-sm">{errors.phone.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 font-semibold text-lg"
          >
            {registerMutation.isPending ? "Registrando..." : "Activar Cuenta"}
            {!registerMutation.isPending && <UserPlus className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </Card>
    </div>
  );
}
