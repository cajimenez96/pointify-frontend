/**
 * POS Validation Schemas
 * Zod schemas for EARN and REDEEM operations
 */

import { z } from 'zod';

//============================================================================
// EARN POINTS SCHEMA
// ============================================================================

export const earnPointsSchema = z.object({
  dni: z
    .string()
    .min(7, 'DNI debe tener al menos 7 dígitos')
    .max(8, 'DNI debe tener máximo 8 dígitos')
    .regex(/^\d+$/, 'DNI debe contener solo números'),

  saleCode: z
    .string()
    .min(3, 'Código de venta debe tener al menos 3 caracteres')
    .max(50, 'Código de venta demasiado largo'),

  productName: z
    .string()
    .min(1, 'Selecciona un producto'),
});

export type EarnPointsForm = z.infer<typeof earnPointsSchema>;

// ============================================================================
// REDEEM POINTS SCHEMA
// ============================================================================

export const redeemPointsSchema = z.object({
  dni: z
    .string()
    .min(7, 'DNI debe tener al menos 7 dígitos')
    .max(8, 'DNI debe tener máximo 8 dígitos')
    .regex(/^\d+$/, 'DNI debe contener solo números'),

  rewardId: z
    .string()
    .min(1, 'Selecciona un premio'),
});

export type RedeemPointsForm = z.infer<typeof redeemPointsSchema>;

// ============================================================================
// CLIENT SEARCH SCHEMA
// ============================================================================

export const clientSearchSchema = z.object({
  dni: z
    .string()
    .min(7, 'DNI debe tener al menos 7 dígitos')
    .max(8, 'DNI debe tener máximo 8 dígitos')
    .regex(/^\d+$/, 'DNI debe contener solo números'),
});

export type ClientSearchForm = z.infer<typeof clientSearchSchema>;
