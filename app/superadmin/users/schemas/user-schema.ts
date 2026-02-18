import { z } from "zod";

/**
 * Validation schema for User form
 */
export const userSchema = z.object({
  companyId: z.string().min(1, "Empresa requerida"),
  username: z.string().min(3, "Mínimo 3 caracteres"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  name: z.string().min(2, "Nombre requerido"),
  dni: z.string().min(7, "DNI inválido"),
  role: z.enum(["admin", "cashier"]),
});

export const userEditSchema = z.object({
  companyId: z.string().min(1, "Empresa requerida"),
  username: z.string().min(3, "Mínimo 3 caracteres"),
  password: z.union([
    z.string().length(0),
    z.string().min(6, "Mínimo 6 caracteres")
  ]).optional(),
  name: z.string().min(2, "Nombre requerido"),
  dni: z.string().min(7, "DNI inválido"),
  role: z.enum(["admin", "cashier"]),
  isActive: z.boolean().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UserEditFormData = z.infer<typeof userEditSchema>;
