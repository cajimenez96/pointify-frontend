import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Instancia configurada de Axios para comunicación con el backend
 * Base URL se obtiene de las variables de entorno
 */
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor de Request: Agrega automáticamente el token JWT
 * Se obtiene del localStorage y se anexa en el header Authorization
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Obtener token del localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    // Si existe token, agregarlo al header
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor de Response: Manejo centralizado de errores
 * Detecta errores comunes (401, 404, 500) y tokens expirados
 */
api.interceptors.response.use(
  (response) => {
    // Respuesta exitosa, retornar tal cual
    return response;
  },
  (error: AxiosError) => {
    // Manejo de errores específicos
    if (error.response) {
      const { status } = error.response;
      
      // Token expirado o inválido
      if (status === 401) {
        // Limpiar sesión solo si no es la ruta de login
        if (!error.config?.url?.includes('/auth/login')) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Redirigir al login solo si no estamos en rutas públicas
            const currentPath = window.location.pathname;
            const publicPaths = ['/portal', '/auth/signin'];
            const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));
            
            if (!isPublicPath) {
              window.location.href = '/auth/signin';
            }
          }
        }
      }
      
      // Servidor no disponible
      if (status === 503) {
        console.error('Servicio temporalmente no disponible');
      }
      
      // Error interno del servidor
      if (status === 500) {
        console.error('Error interno del servidor');
      }
    } else if (error.request) {
      // Request fue enviado pero no hubo respuesta
      console.error('Sin respuesta del servidor. Verifica tu conexión a internet.');
    } else {
      // Error al configurar el request
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Helper function para extraer mensaje de error legible
 */
export const getErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    // Mensaje del backend (ya está en español)
    return Array.isArray(error.response.data.message) 
      ? error.response.data.message[0] 
      : error.response.data.message;
  }
  
  if (error.message === 'Network Error') {
    return 'Error de conexión. Verifica que el backend esté ejecutándose.';
  }
  
  if (error.code === 'ECONNABORTED') {
    return 'Tiempo de espera agotado. Intenta nuevamente.';
  }
  
  return 'Error inesperado. Por favor, intenta nuevamente.';
};

/**
 * Helper function para verificar si hay token
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Helper function para obtener usuario actual
 */
export const getCurrentUser = (): any | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Helper function para logout
 */
export const logout = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/signin';
  }
};

export default api;
