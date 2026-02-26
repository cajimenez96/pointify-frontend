/**
 * Auth Validation Schemas
 * Shared Zod schemas for all login forms
 */

import { z } from 'zod';

// ============================================================================
// FIELD SCHEMAS (reusable building blocks)
// ============================================================================

const usernameField = z
  .string()
  .min(3, 'El usuario debe tener al menos 3 caracteres');

const passwordField = z
  .string()
  .min(6, 'La contraseña debe tener al menos 6 caracteres');

const companyCodeField = z
  .string()
  .min(3, 'El código de empresa debe tener al menos 3 caracteres');

// ============================================================================
// FORM SCHEMAS
// ============================================================================

export const superAdminLoginSchema = z.object({
  username: usernameField,
  password: passwordField,
});

export const tenantLoginSchema = z.object({
  companyCode: companyCodeField,
  username: usernameField,
  password: passwordField,
});

// ============================================================================
// INFERRED TYPES
// ============================================================================

export type SuperAdminLoginForm = z.infer<typeof superAdminLoginSchema>;
export type TenantLoginForm = z.infer<typeof tenantLoginSchema>;
