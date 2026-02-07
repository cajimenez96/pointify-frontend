import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { companySchema, type CompanyFormData } from "../schemas/company-schema";

interface CompanyFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CompanyFormData>;
  onSubmit: (data: CompanyFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CompanyForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: CompanyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      maxUsers: 0,
      maxClients: 0,
      ...defaultValues,
    },
  });

  const isEditMode = mode === "edit";

  return (
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
            disabled={isEditMode}
            {...register("companyCode")}
          />
          {errors.companyCode && (
            <p className="text-sm text-red-400">{errors.companyCode.message}</p>
          )}
          {isEditMode && (
            <p className="text-xs text-slate-500">No se puede modificar</p>
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
            disabled={isEditMode}
            {...register("cuitCuil")}
          />
          {errors.cuitCuil && (
            <p className="text-sm text-red-400">{errors.cuitCuil.message}</p>
          )}
          {isEditMode && (
            <p className="text-xs text-slate-500">No se puede modificar</p>
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
          <p className="text-sm text-red-400">{errors.businessName.message}</p>
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
            <Label htmlFor="subscriptionEndDate" className="text-slate-200">
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? mode === "create"
              ? "Creando..."
              : "Actualizando..."
            : mode === "create"
              ? "Crear Empresa"
              : "Actualizar Empresa"}
        </Button>
      </div>
    </form>
  );
}
