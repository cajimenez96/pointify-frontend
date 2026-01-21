'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/lib/auth-store';

const AdminLoginPage = () => {
  const router = useRouter();
  const { user, isLoading, initializeAuth, login } = useAuthStore();

  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && user?.role === 'admin') {
      router.replace('/admin/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Pointify</CardTitle>
            <CardDescription>Cargando sesión...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role === 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Redirigiendo...</CardTitle>
            <CardDescription>Ya tienes una sesión de administrador activa.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (!dni.trim() || !password.trim()) {
      setErrorMessage('Por favor ingresa tu DNI y contraseña.');
      return;
    }

    setIsSubmitting(true);

    try {
      await login(dni.trim(), password);
      const newUser = useAuthStore.getState().user;

      if (newUser?.role === 'admin') {
        router.push('/admin/dashboard');
        return;
      }

      setErrorMessage('No tienes permisos de administrador.');
    } catch (error: unknown) {
      const responseStatus = (error as { response?: { status?: number } })?.response?.status;

      if (responseStatus === 401) {
        setErrorMessage('Credenciales inválidas. Verifica tu DNI y contraseña.');
        return;
      }

      if (responseStatus === 400) {
        setErrorMessage('Datos inválidos. Revisa el formato de los campos.');
        return;
      }

      setErrorMessage('Ocurrió un error inesperado. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">Panel Admin</CardTitle>
          <CardDescription className="text-gray-600">
            Inicia sesión con tus credenciales de administrador
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="dni">DNI</Label>
              <Input
                id="dni"
                name="dni"
                aria-label="DNI de administrador"
                tabIndex={0}
                value={dni}
                onChange={(event) => setDni(event.target.value)}
                placeholder="Ingresa tu DNI"
                disabled={isSubmitting}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                aria-label="Contraseña de administrador"
                tabIndex={0}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center">
          <button
            type="button"
            className="text-sm text-indigo-700 hover:underline"
            onClick={() => router.push('/')}
            tabIndex={0}
            aria-label="Volver al inicio"
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                router.push('/');
              }
            }}
          >
            Volver al inicio
          </button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
