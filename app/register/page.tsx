'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api-client';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dniFromUrl = searchParams.get('dni');

  const [dni, setDni] = useState(dniFromUrl || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!dniFromUrl) {
      router.push('/check');
    }
  }, [dniFromUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await apiClient.post('/clients/complete-profile', {
        dni,
        name,
        email,
        phone,
      });

      // Redirect to check page with success
      router.push(`/check?dni=${dni}&registered=true`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al completar el perfil');
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Completar Perfil</h1>
        <p className="text-gray-600 mt-2">
          Completa tus datos para continuar acumulando puntos
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-6 text-sm">
        ℹ️ Tus puntos ya están guardados. Solo necesitamos algunos datos más.
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="dni">DNI</Label>
          <Input
            id="dni"
            type="text"
            value={dni}
            disabled
            className="bg-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="name">Nombre Completo *</Label>
          <Input
            id="name"
            type="text"
            placeholder="Juan Pérez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <Label htmlFor="email">Correo Electrónico *</Label>
          <Input
            id="email"
            type="email"
            placeholder="juan@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="1234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Completar Registro'}
        </Button>
      </form>
    </Card>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <Suspense fallback={
        <Card className="w-full max-w-md p-8">
          <div className="text-center">Cargando...</div>
        </Card>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}

