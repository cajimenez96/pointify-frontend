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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema de validación
const userSchema = z.object({
  companyId: z.string().min(1, "Empresa requerida"),
  username: z.string().min(3, "Mínimo 3 caracteres"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  name: z.string().min(2, "Nombre requerido"),
  dni: z.string().min(7, "DNI inválido"),
  role: z.enum(["admin", "cashier"]),
});

type UserForm = z.infer<typeof userSchema>;

interface User {
  _id: string;
  username: string;
  name: string;
  dni: string;
  role: string;
  isActive: boolean;
  company?: {
    companyCode: string;
    businessName: string;
  };
  createdAt: string;
}

interface Company {
  _id: string;
  companyCode: string;
  businessName: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  // Cargar datos
  const fetchData = async () => {
    try {
      const [usersResponse, companiesResponse] = await Promise.all([
        apiClient.get("/superadmin/users"),
        apiClient.get("/superadmin/companies"),
      ]);

      setUsers(usersResponse.data.data || usersResponse.data);
      setCompanies(companiesResponse.data.data || companiesResponse.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Crear usuario
  const onSubmit = async (data: UserForm) => {
    setIsSubmitting(true);

    try {
      await apiClient.post("/superadmin/users", data);

      toast.success("Usuario creado exitosamente");
      setIsDialogOpen(false);
      reset();
      fetchData();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Error al crear usuario";
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
          <h1 className="text-3xl font-bold text-white mb-2">Usuarios</h1>
          <p className="text-slate-400">
            Gestiona todos los usuarios del sistema
          </p>
        </div>

        {/* Botón Crear */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
              + Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Crear Nuevo Usuario
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Company */}
              <div className="space-y-2">
                <Label htmlFor="companyId" className="text-slate-200">
                  Empresa *
                </Label>
                <Select onValueChange={(value) => setValue("companyId", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    {companies.map((company) => (
                      <SelectItem key={company._id} value={company._id}>
                        {company.businessName} ({company.companyCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.companyId && (
                  <p className="text-sm text-red-400">
                    {errors.companyId.message}
                  </p>
                )}
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-200">
                  Rol *
                </Label>
                <Select
                  onValueChange={(value) =>
                    setValue("role", value as "admin" | "cashier")
                  }
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600 text-white">
                    <SelectItem value="admin">Administrador</SelectItem>
                    <SelectItem value="cashier">Cajero</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-red-400">{errors.role.message}</p>
                )}
              </div>

              {/* Name & DNI */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-200">
                    Nombre Completo *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Juan Pérez"
                    className="bg-slate-700 border-slate-600 text-white"
                    {...register("name")}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dni" className="text-slate-200">
                    DNI *
                  </Label>
                  <Input
                    id="dni"
                    placeholder="12345678"
                    className="bg-slate-700 border-slate-600 text-white"
                    {...register("dni")}
                  />
                  {errors.dni && (
                    <p className="text-sm text-red-400">{errors.dni.message}</p>
                  )}
                </div>
              </div>

              {/* Username & Password */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-200">
                    Usuario *
                  </Label>
                  <Input
                    id="username"
                    placeholder="juan.perez"
                    className="bg-slate-700 border-slate-600 text-white"
                    {...register("username")}
                  />
                  {errors.username && (
                    <p className="text-sm text-red-400">
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-200">
                    Contraseña *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="bg-slate-700 border-slate-600 text-white"
                    {...register("password")}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400">
                      {errors.password.message}
                    </p>
                  )}
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
                  {isSubmitting ? "Creando..." : "Crear Usuario"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de Usuarios */}
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Usuario
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Nombre
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  DNI
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Empresa
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Rol
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-slate-400">
                    No hay usuarios creados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="p-4 text-white font-mono">
                      {user.username}
                    </td>
                    <td className="p-4 text-white">{user.name}</td>
                    <td className="p-4 text-slate-300">{user.dni}</td>
                    <td className="p-4 text-slate-300">
                      {user.company ? (
                        <div>
                          <div className="font-semibold">
                            {user.company.businessName}
                          </div>
                          <div className="text-sm text-slate-400">
                            {user.company.companyCode}
                          </div>
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          user.role === "admin"
                            ? "bg-blue-900/50 text-blue-300"
                            : "bg-orange-900/50 text-orange-300"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Cajero"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          user.isActive
                            ? "bg-green-900/50 text-green-300"
                            : "bg-red-900/50 text-red-300"
                        }`}
                      >
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
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
