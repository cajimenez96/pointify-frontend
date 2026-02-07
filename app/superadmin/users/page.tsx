"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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
import { SearchInput } from "@/components/ui/search-input";
import { useUsers } from "./hooks/useUsers";
import { useCreateUser } from "./hooks/useCreateUser";
// import { useCompanies } from "../companies/hooks/useCompanies";
import type { CreateUserBySuperAdminDto } from "@/repositories/superadmin/users/types";

// Schema de validación basado en CreateUserBySuperAdminDto
const userSchema = z.object({
  companyId: z.string().min(1, "Empresa requerida"),
  username: z.string().min(3, "Mínimo 3 caracteres"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  name: z.string().min(2, "Nombre requerido"),
  dni: z.string().min(7, "DNI inválido"),
  role: z.enum(["admin", "cashier"]),
});

type UserForm = z.infer<typeof userSchema>;

export default function UsersPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState("all");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");

  // Hooks
  const { users, pagination, isLoading, error, refetch, setFilters } =
    useUsers();
  const {
    createUserMutation,
    isCreating,
    reset: resetCreate,
  } = useCreateUser();
  const { companies, isLoading: isLoadingCompanies } = useCompanies();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  // Crear usuario
  const onSubmit = async (data: UserForm) => {
    try {
      const dto: CreateUserBySuperAdminDto = {
        companyId: data.companyId,
        username: data.username,
        password: data.password,
        name: data.name,
        dni: data.dni,
        role: data.role,
      };

      await createUserMutation(dto);

      toast.success("Usuario creado exitosamente");
      setIsDialogOpen(false);
      reset();
      resetCreate();
      refetch();
    } catch {
      toast.error("Error al crear usuario");
    }
  };

  // Aplicar filtros
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilters({ username: query || undefined, page: 1 });
  };

  const handleCompanyFilter = (companyId: string) => {
    setSelectedCompanyFilter(companyId);
    const filterValue = companyId === "all" ? undefined : companyId;
    setFilters({ companyId: filterValue, page: 1 });
  };

  const handleRoleFilter = (role: string) => {
    setSelectedRoleFilter(role);
    const filterValue =
      role === "all" ? undefined : (role as "admin" | "cashier");
    setFilters({ role: filterValue, page: 1 });
  };

  if (isLoading || isLoadingCompanies) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
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
              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="companyId" className="text-slate-200">
                  Empresa *
                </Label>
                <Controller
                  name="companyId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue placeholder="Seleccionar empresa" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        {companies.map((company) => (
                          <SelectItem key={company._id} value={company._id}>
                            {company.businessName} ({company.companyCode})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.companyId && (
                  <p className="text-sm text-red-400">
                    {errors.companyId.message}
                  </p>
                )}
              </div>

              {/* Username y Rol */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-slate-200">
                    Username *
                  </Label>
                  <Input
                    id="username"
                    placeholder="usuario.admin"
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
                  <Label htmlFor="role" className="text-slate-200">
                    Rol *
                  </Label>
                  <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="cashier">Cajero</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.role && (
                    <p className="text-sm text-red-400">
                      {errors.role.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-200">
                  Contraseña *
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="bg-slate-700 border-slate-600 text-white"
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-sm text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Nombre y DNI */}
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

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600"
                  disabled={isCreating}
                >
                  {isCreating ? "Creando..." : "Crear Usuario"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="flex gap-4 items-end">
          {/* Búsqueda */}
          <div className="flex-1">
            <Label className="text-slate-200 mb-2 block">Buscar Usuario</Label>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Username..."
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Empresa */}
          <div className="w-[250px]">
            <Label className="text-slate-200 mb-2 block">Empresa</Label>
            <Select
              value={selectedCompanyFilter || "all"}
              onValueChange={setSelectedCompanyFilter}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Empresa" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Todas</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company._id} value={company._id}>
                    {company.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rol */}
          <div className="w-[180px]">
            <Label className="text-slate-200 mb-2 block">Rol</Label>
            <Select
              value={selectedRoleFilter || "all"}
              onValueChange={setSelectedRoleFilter}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Rol" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="cashier">Cajero</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => {
                setFilters({
                  username: searchQuery || undefined,
                  companyId:
                    selectedCompanyFilter === "all"
                      ? undefined
                      : selectedCompanyFilter,
                  role:
                    selectedRoleFilter === "all"
                      ? undefined
                      : (selectedRoleFilter as "admin" | "cashier"),
                  page: 1,
                });
              }}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Filtrar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCompanyFilter("all");
                setSelectedRoleFilter("all");
                setFilters({
                  username: undefined,
                  companyId: undefined,
                  role: undefined,
                  page: 1,
                });
              }}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Limpiar
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla de Usuarios */}
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900 border-b border-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Empresa
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Username
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Nombre
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  DNI
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Rol
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Estado
                </th>
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Creado
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-400">
                    No hay usuarios creados
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-700 hover:bg-slate-700/50"
                  >
                    <td className="p-4 text-white">
                      <div>
                        <p className="font-medium">
                          {user.company?.businessName || "Sin empresa"}
                        </p>
                        <p className="text-sm text-slate-400 font-mono">
                          {user.company?.companyCode || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-white font-mono">
                      {user.username}
                    </td>
                    <td className="p-4 text-white">{user.name}</td>
                    <td className="p-4 text-slate-300">{user.dni}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          user.role === "admin"
                            ? "bg-violet-900/50 text-violet-300"
                            : user.role === "cashier"
                              ? "bg-blue-900/50 text-blue-300"
                              : "bg-slate-900/50 text-slate-300"
                        }`}
                      >
                        {user.role === "admin"
                          ? "Admin"
                          : user.role === "cashier"
                            ? "Cajero"
                            : user.role}
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
                    <td className="p-4 text-slate-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación info */}
        {pagination.total > 0 && (
          <div className="border-t border-slate-700 p-4">
            <p className="text-sm text-slate-400 text-center">
              Mostrando {users.length} de {pagination.total} usuarios
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
