import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  userSchema,
  userEditSchema,
  type UserFormData,
  type UserEditFormData,
} from "../schemas/user-schema";
import type { Company } from "@/repositories/superadmin/companies/types";
import type { UserResponse } from "@/repositories/superadmin/users/types";

interface UserFormProps {
  companies: Company[];
  onSubmit: (data: UserFormData | UserEditFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  isLoadingCompanies?: boolean;
  mode?: "create" | "edit";
  initialData?: UserResponse;
}

export function UserForm({
  companies,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isLoadingCompanies = false,
  mode = "create",
  initialData,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData | UserEditFormData>({
    resolver: zodResolver(mode === "create" ? userSchema : userEditSchema),
    defaultValues:
      mode === "edit" && initialData
        ? {
            companyId: initialData.companyId,
            username: initialData.username,
            name: initialData.name,
            dni: initialData.dni,
            role: initialData.role as "admin" | "cashier",
            password: "",
            isActive: initialData.isActive,
          }
        : undefined,
  });

  const selectedRole = watch("role");
  const selectedCompanyId = watch("companyId");
  const isActive = watch("isActive");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company Select */}
      <div className="space-y-2">
        <Label htmlFor="company">
          Empresa *
        </Label>
        <Select
          value={selectedCompanyId}
          onValueChange={(value) => setValue("companyId", value)}
          disabled={isLoadingCompanies || isSubmitting || mode === "edit"}
        >
          <SelectTrigger id="company">
            <SelectValue placeholder="Seleccionar empresa..." />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {companies.map((company) => (
              <SelectItem
                key={company._id}
                value={company._id}
              >
                <div>
                  <div className="font-medium">{company.businessName}</div>
                  <div className="text-xs text-muted-foreground">
                    {company.companyCode}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.companyId && (
          <p className="text-sm text-destructive">{errors.companyId.message}</p>
        )}
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">
          Username *
        </Label>
        <Input
          id="username"
          {...register("username")}
          placeholder="usuario123"
          disabled={isSubmitting}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">
          Contraseña {mode === "create" ? "*" : "(dejar vacío para no cambiar)"}
        </Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          placeholder="••••••••"
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Nombre Completo *
        </Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Juan Pérez"
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* DNI */}
      <div className="space-y-2">
        <Label htmlFor="dni">
          DNI *
        </Label>
        <Input
          id="dni"
          {...register("dni")}
          placeholder="12345678"
          disabled={isSubmitting}
        />
        {errors.dni && (
          <p className="text-sm text-destructive">{errors.dni.message}</p>
        )}
      </div>

      {/* Role Select */}
      <div className="space-y-2">
        <Label htmlFor="role">
          Rol *
        </Label>
        <Select
          value={selectedRole}
          onValueChange={(value) =>
            setValue("role", value as "admin" | "cashier")
          }
          disabled={isSubmitting}
        >
          <SelectTrigger id="role">
            <SelectValue placeholder="Seleccionar rol..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              Admin
            </SelectItem>
            <SelectItem value="cashier">
              Cashier
            </SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      {/* Active Status (only in edit mode) */}
      {mode === "edit" && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isActive"
            checked={isActive}
            onCheckedChange={(checked) =>
              setValue("isActive", checked as boolean)
            }
            disabled={isSubmitting}
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Usuario activo
          </Label>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting || isLoadingCompanies}
          className="flex-1"
        >
          {isSubmitting
            ? "Guardando..."
            : mode === "create"
              ? "Crear Usuario"
              : "Actualizar Usuario"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
