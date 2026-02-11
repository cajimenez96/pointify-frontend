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
          <Label htmlFor="companyCode">
            Código de Empresa *
          </Label>
          <Input
            id="companyCode"
            placeholder="EMP001"
            disabled={isEditMode}
            {...register("companyCode")}
          />
          {errors.companyCode && (
            <p className="text-sm text-destructive">{errors.companyCode.message}</p>
          )}
          {isEditMode && (
            <p className="text-xs text-muted-foreground">No se puede modificar</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuitCuil">
            CUIT/CUIL * (11 dígitos)
          </Label>
          <Input
            id="cuitCuil"
            placeholder="20123456789"
            maxLength={11}
            disabled={isEditMode}
            {...register("cuitCuil")}
          />
          {errors.cuitCuil && (
            <p className="text-sm text-destructive">{errors.cuitCuil.message}</p>
          )}
          {isEditMode && (
            <p className="text-xs text-muted-foreground">No se puede modificar</p>
          )}
        </div>
      </div>

      {/* Business Name */}
      <div className="space-y-2">
        <Label htmlFor="businessName">
          Razón Social *
        </Label>
        <Input
          id="businessName"
          placeholder="Mi Empresa S.A."
          {...register("businessName")}
        />
        {errors.businessName && (
          <p className="text-sm text-destructive">{errors.businessName.message}</p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">
          Dirección
        </Label>
        <Input
          id="address"
          placeholder="Av. Corrientes 1234, CABA"
          {...register("address")}
        />
      </div>

      {/* Contact Info Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Información de Contacto
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contactName">
              Nombre del Contacto *
            </Label>
            <Input
              id="contactName"
              placeholder="Juan Pérez"
              {...register("contactName")}
            />
            {errors.contactName && (
              <p className="text-sm text-destructive">
                {errors.contactName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">
                Teléfono *
              </Label>
              <Input
                id="contactPhone"
                placeholder="+54 11 1234-5678"
                {...register("contactPhone")}
              />
              {errors.contactPhone && (
                <p className="text-sm text-destructive">
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">
                Email *
              </Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contacto@empresa.com"
                {...register("contactEmail")}
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive">
                  {errors.contactEmail.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subscription & Limits */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Suscripción y Límites
        </h3>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subscriptionEndDate">
              Fecha de Expiración
            </Label>
            <p className="text-xs text-muted-foreground">
              Dejar vacío para suscripción ilimitada
            </p>
            <Input
              id="subscriptionEndDate"
              type="date"
              {...register("subscriptionEndDate")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsers">
                Límite de Usuarios (0 = sin límite)
              </Label>
              <Input
                id="maxUsers"
                type="number"
                {...register("maxUsers", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxClients">
                Límite de Clientes (0 = sin límite)
              </Label>
              <Input
                id="maxClients"
                type="number"
                {...register("maxClients", { valueAsNumber: true })}
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
          className="flex-1"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="flex-1"
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
