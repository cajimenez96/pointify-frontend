import { useState } from 'react';
import toast from 'react-hot-toast';

export function useFormState() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async <T,>(
    requestFn: () => Promise<T>,
    loadingMsg: string = 'Procesando...',
    successMsg?: string
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    const toastId = toast.loading(loadingMsg);

    try {
      const result = await requestFn();
      if (successMsg) {
        toast.success(successMsg, { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
      return result;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Error inesperado';
      setError(errorMessage);
      toast.error(errorMessage, { id: toastId });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleRequest };
}
