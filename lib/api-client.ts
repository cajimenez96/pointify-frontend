import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Crear instancia de Axios
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Request: Agregar Authorization header
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Obtener token del localStorage (zustand persist lo guarda aquí)
      const authStorage = localStorage.getItem('pointify-auth-storage');
      
      if (authStorage) {
        try {
          const { state } = JSON.parse(authStorage);
          const token = state?.accessToken;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('[API Client] Error parsing auth storage:', error);
        }
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Response: Manejo global de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // 401 Unauthorized: Token inválido o expirado
    if (status === 401) {
      console.warn('[API Client] 401 Unauthorized - Token inválido o expirado');
      
      if (typeof window !== 'undefined') {
        // Limpiar localStorage
        localStorage.removeItem('pointify-auth-storage');
        
        // Redirigir al login
        const currentPath = window.location.pathname;
        
        // Determinar ruta de login según el contexto
        if (currentPath.startsWith('/superadmin')) {
          window.location.href = '/superadmin/login';
        } else if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin/login';
        } else if (currentPath.startsWith('/pos')) {
          window.location.href = '/pos';
        } else {
          window.location.href = '/';
        }
      }
    }

    // 402 Payment Required: Suscripción expirada
    if (status === 402) {
      console.error('[API Client] 402 Payment Required - Suscripción expirada');
      
      if (typeof window !== 'undefined') {
        // Redirigir a página de suscripción expirada
        window.location.href = '/subscription-expired';
      }
    }

    // 403 Forbidden: Sin permisos
    if (status === 403) {
      console.warn('[API Client] 403 Forbidden - Sin permisos');
      
      const errorMessage = 
        (error.response?.data as { message?: string })?.message || 
        'No tienes permisos para realizar esta acción';

      toast.error(errorMessage);
    }

    // 400 Bad Request: Datos inválidos
    if (status === 400) {
      const errorMessage = 
        (error.response?.data as { message?: string })?.message || 
        'Datos inválidos';

      toast.error(errorMessage);
    }

    // 404 Not Found
    if (status === 404) {
      const errorMessage = 
        (error.response?.data as { message?: string })?.message || 
        'Recurso no encontrado';

      toast.error(errorMessage);
    }

    // 500 Internal Server Error
    if (status && status >= 500) {
      toast.error('Error del servidor. Por favor, inténtalo de nuevo más tarde.');
    }

    return Promise.reject(error);
  }
);

// Named export for repository pattern
export { apiClient };

// Default export for backwards compatibility
export default apiClient;
