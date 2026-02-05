"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import apiClient from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Schema de validación
const companySchema = z.object({
  companyCode: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres"),
  businessName: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(8, "Teléfono inválido"),
  address: z.string().optional(),
  maxUsers: z.number().min(0).optional(),
  maxClients: z.number().min(0).optional(),
});

type CompanyForm = z.infer<typeof companySchema>;

interface Company {
  _id: string;
  companyCode: string;
  businessName: string;
  contactInfo: {
    email: string;
    phone: string;
    address?: string;
  };
  isActive: boolean;
  maxUsers?: number;
  maxClients?: number;
  createdAt: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      maxUsers: 0,
      maxClients: 0,
    },
  });

  // Cargar empresas
  const fetchCompanies = async () => {
    try {
      const response = await apiClient.get("/superadmin/companies");
      setCompanies(response.data.data || response.data);
    } catch (error) {
      console.error("Error al cargar empresas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Crear empresa
  const onSubmit = async (data: CompanyForm) => {
    setIsSubmitting(true);

    try {
      await apiClient.post("/superadmin/companies", {
        companyCode: data.companyCode,
        businessName: data.businessName,
        contactInfo: {
          email: data.email,
          phone: data.phone,
          address: data.address || "",
        },
        maxUsers: data.maxUsers || 0,
        maxClients: data.maxClients || 0,
        subscriptionEndDate: null,
      });

      toast.success("Empresa creada exitosamente");
      setIsDialogOpen(false);
      reset();
      fetchCompanies();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al crear empresa";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Empresas</h1>
          <p className="text-slate-400">
            Gestiona todas las empresas del sistema
          </p>
        </div>

        {/* Botón Crear */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
              + Nueva Empresa
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Crear Nueva Empresa
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Company Code */}
              <div className="space-y-2">
                <Label htmlFor="companyCode" className="text-slate-200">
                  Código de Empresa *
                </Label>
                <Input
                  id="companyCode"
                  placeholder="EMP001"
                  className="bg-slate-700 border-slate-600 text-white"
                  {...register("companyCode")}
                />
                {errors.companyCode && (
                  <p className="text-sm text-red-400">
                    {errors.companyCode.message}
                  </p>
                )}
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName" className="text-slate-200">
                  Razón Social *
                </Label>
                <Input
                  id="businessName"
                  placeholder="Mi Empresa S.A."
                  className="bg-slate-700 border-slate-600 text-white"
                  {...register("businessName")}
                />
                {errors.businessName && (
                  <p className="text-sm text-red-400">
                    {errors.businessName.message}
                  </p>
                )}
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contacto@empresa.com"
                    className="bg-slate-700 border-slate-600 text-white"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-400">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-200">
                    Teléfono *
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+54 11 1234-5678"
                    className="bg-slate-700 border-slate-600 text-white"
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-400">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-200">
                  Dirección
                </Label>
                <Input
                  id="address"
                  placeholder="Av. Corrientes 1234"
                  className="bg-slate-700 border-slate-600 text-white"
                  {...register("address")}
                />
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxUsers" className="text-slate-200">
                    Límite de Usuarios (0 = sin límite)
                  </Label>
                  <Input
                    id="maxUsers"
                    type="number"
                    {...register("maxUsers", { valueAsNumber: true })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxClients" className="text-slate-200">
                    Límite de Clientes (0 = sin límite)
                  </Label>
                  <Input
                    id="maxClients"
                    type="number"
                    {...register("maxClients", { valueAsNumber: true })}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creando..." : "Crear Empresa"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Empresas */}
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Código
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Razón Social
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Email
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Estado
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Creada
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-slate-400">
                    No hay empresas creadas
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr
                    key={company._id}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="p-4 text-white font-mono">
                      {company.companyCode}
                    </td>
                    <td className="p-4 text-white">{company.businessName}</td>
                    <td className="p-4 text-slate-300">
                      {company.contactInfo.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          company.isActive
                            ? "bg-green-900/50 text-green-300"
                            : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {company.isActive ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(company.createdAt).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
