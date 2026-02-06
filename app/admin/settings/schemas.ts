/**
 * Admin Settings Validation Schemas
 * Zod schemas for products and rewards management
 */

import { z } from 'z

';

// ============================================================================
// PRODUCT SCHEMAS
// ============================================================================

export const productSchema = z.object({
  productName: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre demasiado largo')
    .regex(/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/, 'Solo letras, números y espacios'),

  pointsValue: z
    .number()
    .min(1, 'Puntos deben ser mínimo 1')
    .max(10000, 'Puntos máximo 10000'),
});

export type ProductForm = z.infer<typeof productSchema>;

// ============================================================================
// REWARD SCHEMAS
// ============================================================================

export const rewardSchema = z.object({
  name: z
    .string()
    .min(2, 'Nombre debe tener al menos 2 caracteres')
    .max(100, 'Nombre demasiado largo'),

  description: z
    .string()
    .max(500, 'Descripción demasiado larga')
    .optional(),

  pointsCost: z
    .number()
    .min(1, 'Costo debe ser mínimo 1 punto')
    .max(100000, 'Costo máximo 100,000 puntos'),

  stock: z
    .number()
    .min(0, 'Stock no puede ser negativo')
    .nullable()
    .optional(),

  imageUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),

  isUnlimitedStock: z.boolean().default(false),
});

export type RewardForm = z.infer<typeof rewardSchema>;
