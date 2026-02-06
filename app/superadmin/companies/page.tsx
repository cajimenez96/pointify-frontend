"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MoreVertical } from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";
import { useCompanies } from "./hooks/useCompanies";
import { useCreateCompany } from "./hooks/useCreateCompany";
import { useUpdateCompany } from "./hooks/useUpdateCompany";
import type {
  CreateCompanyDto,
  UpdateCompanyDto,
  Company,
} from "@/repositories/superadmin/companies/types";

// Schema de validación basado en CreateCompanyDto
const companySchema = z.object({
  companyCode: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres"),
  businessName: z
    .string()
    .min(2, "Mínimo 2 caracteres")
    .max(200, "Máximo 200 caracteres"),
  cuitCuil: z.string().regex(/^\d{11}$/, "CUIT/CUIL debe tener 11 dígitos"),
  address: z.string().optional(),
  contactName: z.string().min(1, "Nombre de contacto requerido"),
  contactPhone: z.string().min(1, "Teléfono requerido"),
  contactEmail: z.string().email("Email inválido"),
  subscriptionEndDate: z.string().optional(),
  maxUsers: z.number().min(0).optional(),
  maxClients: z.number().min(0).optional(),
});

type CompanyForm = z.infer<typeof companySchema>;

export default function CompaniesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Usar hooks
  const { companies, pagination, isLoading, error, refetch, setQuery } =
    useCompanies();
  const {
    createCompanyMutation,
    isCreating,
    reset: resetCreate,
  } = useCreateCompany();
  const {
    updateCompanyMutation,
    isUpdating,
    reset: resetUpdate,
  } = useUpdateCompany();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      maxUsers: 0,
      maxClients: 0,
    },
  });

  // Abrir modal de edición
  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    // Pre-llenar el formulario
    setValue("companyCode", company.companyCode);
    setValue("businessName", company.businessName);
    setValue("cuitCuil", company.cuitCuil);
    setValue("address", company.address || "");
    setValue("contactName", company.contactInfo.name);
    setValue("contactPhone", company.contactInfo.phone);
    setValue("contactEmail", company.contactInfo.email);
    setValue(
      "subscriptionEndDate",
      company.subscriptionEndDate
        ? new Date(company.subscriptionEndDate).toISOString().split("T")[0]
        : "",
    );
    setValue("maxUsers", company.maxUsers || 0);
    setValue("maxClients", company.maxClients || 0);
    setIsEditDialogOpen(true);
  };

  // Crear empresa
  const onSubmit = async (data: CompanyForm) => {
    try {
      const dto: CreateCompanyDto = {
        companyCode: data.companyCode,
        businessName: data.businessName,
        cuitCuil: data.cuitCuil,
        address: data.address,
        contactInfo: {
          name: data.contactName,
          phone: data.contactPhone,
          email: data.contactEmail,
        },
        subscriptionEndDate: data.subscriptionEndDate || null,
        maxUsers: data.maxUsers || 0,
        maxClients: data.maxClients || 0,
      };

      await createCompanyMutation(dto);

      toast.success("Empresa creada exitosamente");
      setIsDialogOpen(false);
      reset();
      resetCreate();
      refetch(); // Recargar lista
    } catch {
      toast.error("Error al crear empresa");
    }
  };

  // Actualizar empresa
  const onUpdate = async (data: CompanyForm) => {
    if (!selectedCompany) return;

    try {
      const dto: UpdateCompanyDto = {
        businessName: data.businessName,
        address: data.address,
        contactInfo: {
          name: data.contactName,
          phone: data.contactPhone,
          email: data.contactEmail,
        },
        subscriptionEndDate: data.subscriptionEndDate || null,
        maxUsers: data.maxUsers || 0,
        maxClients: data.maxClients || 0,
      };

      await updateCompanyMutation(selectedCompany._id, dto);

      toast.success("Empresa actualizada exitosamente");
      setIsEditDialogOpen(false);
      setSelectedCompany(null);
      reset();
      resetUpdate();
      refetch();
    } catch {
      toast.error("Error al actualizar empresa");
    }
  };

  if (isLoading) {
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
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                Crear Nueva Empresa
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Company Code & CUIT/CUIL */}
              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="cuitCuil" className="text-slate-200">
                    CUIT/CUIL * (11 dígitos)
                  </Label>
                  <Input
                    id="cuitCuil"
                    placeholder="20123456789"
                    maxLength={11}
                    className="bg-slate-700 border-slate-600 text-white"
                    {...register("cuitCuil")}
                  />
                  {errors.cuitCuil && (
                    <p className="text-sm text-red-400">
                      {errors.cuitCuil.message}
                    </p>
                  )}
                </div>
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

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-200">
                  Dirección
                </Label>
                <Input
                  id="address"
                  placeholder="Av. Corrientes 1234, CABA"
                  className="bg-slate-700 border-slate-600 text-white"
                  {...register("address")}
                />
              </div>

              {/* Contact Info Section */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Información de Contacto
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactName" className="text-slate-200">
                      Nombre del Contacto *
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="Juan Pérez"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...register("contactName")}
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-400">
                        {errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPhone" className="text-slate-200">
                        Teléfono *
                      </Label>
                      <Input
                        id="contactPhone"
                        placeholder="+54 11 1234-5678"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...register("contactPhone")}
                      />
                      {errors.contactPhone && (
                        <p className="text-sm text-red-400">
                          {errors.contactPhone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactEmail" className="text-slate-200">
                        Email *
                      </Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        placeholder="contacto@empresa.com"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...register("contactEmail")}
                      />
                      {errors.contactEmail && (
                        <p className="text-sm text-red-400">
                          {errors.contactEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription & Limits */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Suscripción y Límites
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="subscriptionEndDate"
                      className="text-slate-200"
                    >
                      Fecha de Expiración
                    </Label>
                    <p className="text-xs text-slate-400">
                      Dejar vacío para suscripción ilimitada
                    </p>
                    <Input
                      id="subscriptionEndDate"
                      type="date"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...register("subscriptionEndDate")}
                    />
                  </div>

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
                  {isCreating ? "Creando..." : "Crear Empresa"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Diálogo de Edición */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) {
              setSelectedCompany(null);
              reset();
            }
          }}
        >
          <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Actualizar Empresa</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
              {/* Company Code & CUIT/CUIL (Read-only) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-slate-200">Código de Empresa</Label>
                  <Input
                    value={selectedCompany?.companyCode || ""}
                    disabled
                    className="bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500">
                    No se puede modificar
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-200">CUIT/CUIL</Label>
                  <Input
                    value={selectedCompany?.cuitCuil || ""}
                    disabled
                    className="bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500">
                    No se puede modificar
                  </p>
                </div>
              </div>

              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-businessName" className="text-slate-200">
                  Razón Social *
                </Label>
                <Input
                  id="edit-businessName"
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

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="edit-address" className="text-slate-200">
                  Dirección
                </Label>
                <Input
                  id="edit-address"
                  placeholder="Av. Corrientes 1234, CABA"
                  className="bg-slate-700 border-slate-600 text-white"
                  {...register("address")}
                />
              </div>

              {/* Contact Info Section */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Información de Contacto
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-contactName"
                      className="text-slate-200"
                    >
                      Nombre del Contacto *
                    </Label>
                    <Input
                      id="edit-contactName"
                      placeholder="Juan Pérez"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...register("contactName")}
                    />
                    {errors.contactName && (
                      <p className="text-sm text-red-400">
                        {errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-contactPhone"
                        className="text-slate-200"
                      >
                        Teléfono *
                      </Label>
                      <Input
                        id="edit-contactPhone"
                        placeholder="+54 11 1234-5678"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...register("contactPhone")}
                      />
                      {errors.contactPhone && (
                        <p className="text-sm text-red-400">
                          {errors.contactPhone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-contactEmail"
                        className="text-slate-200"
                      >
                        Email *
                      </Label>
                      <Input
                        id="edit-contactEmail"
                        type="email"
                        placeholder="contacto@empresa.com"
                        className="bg-slate-700 border-slate-600 text-white"
                        {...register("contactEmail")}
                      />
                      {errors.contactEmail && (
                        <p className="text-sm text-red-400">
                          {errors.contactEmail.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription & Limits */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  Suscripción y Límites
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="edit-subscriptionEndDate"
                      className="text-slate-200"
                    >
                      Fecha de Expiración
                    </Label>
                    <p className="text-xs text-slate-400">
                      Dejar vacío para suscripción ilimitada
                    </p>
                    <Input
                      id="edit-subscriptionEndDate"
                      type="date"
                      className="bg-slate-700 border-slate-600 text-white"
                      {...register("subscriptionEndDate")}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-maxUsers" className="text-slate-200">
                        Límite de Usuarios (0 = sin límite)
                      </Label>
                      <Input
                        id="edit-maxUsers"
                        type="number"
                        {...register("maxUsers", { valueAsNumber: true })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="edit-maxClients"
                        className="text-slate-200"
                      >
                        Límite de Clientes (0 = sin límite)
                      </Label>
                      <Input
                        id="edit-maxClients"
                        type="number"
                        {...register("maxClients", { valueAsNumber: true })}
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isUpdating}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Actualizando..." : "Actualizar Empresa"}
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
            <Label className="text-slate-200 mb-2 block">Buscar Empresa</Label>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Código o nombre de empresa..."
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Estado */}
          <div className="w-[200px]">
            <Label className="text-slate-200 mb-2 block">Estado</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="inactive">Inactivas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Botones */}
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => {
                setQuery({
                  businessName: searchQuery || undefined,
                  isActive:
                    statusFilter === "all"
                      ? undefined
                      : statusFilter === "active",
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
                setStatusFilter("all");
                setQuery({
                  businessName: undefined,
                  isActive: undefined,
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
                  CUIT/CUIL
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
                <th className="text-left p-4 text-slate-300 font-semibold">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-slate-400">
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
                    <td className="p-4 text-slate-300">{company.cuitCuil}</td>
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
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700 text-white"
                        >
                          <DropdownMenuItem
                            onClick={() => handleEdit(company)}
                            className="cursor-pointer hover:bg-slate-700"
                          >
                            Actualizar datos
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
              Mostrando {companies.length} de {pagination.total} empresas
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}
