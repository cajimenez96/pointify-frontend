import { z } from "zod";

/**
 * Validation schema for Company form
 */
export const companySchema = z.object({
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

export type CompanyFormData = z.infer<typeof companySchema>;
