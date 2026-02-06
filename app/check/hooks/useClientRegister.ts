/**
 * useClientRegister Hook
 * Handles client registration for pending users
 */

import { useState } from 'react';
import apiClient from '@/lib/api-client';
import { toast } from 'sonner';

interface RegisterData {
  dni: string;
  companyCode: string;
  name: string;
  email: string;
  phone: string;
}

export function useClientRegister() {
  const [isRegistering, setIsRegistering] = useState(false);

  const registerClient = async (data: RegisterData) => {
    setIsRegistering(true);
    try {
      await apiClient.post(`/clients/complete-profile`, data);
      toast.success('¡Registro completado! Bienvenido a Pointify.');
      return true;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error al registrar cliente';
      toast.error(message);
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  return {
    registerClient,
    isRegistering,
  };
}
