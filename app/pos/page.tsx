'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api-client';

export default function POSPage() {
  const { user } = useAuthStore();
  const [dni, setDni] = useState('');
  const [saleCode, setSaleCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  // Login rápido para demo (en producción sería un formulario separado)
  const [loginDni, setLoginDni] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginDni, loginPassword);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error de autenticación');
    }
  };

  const handleAddPoints = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await apiClient.post('/transactions/add', {
        dni,
        saleCode,
      });
      setResult(response.data);
      setDni('');
      setSaleCode('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al agregar puntos');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Login Cajero</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-dni">DNI</Label>
              <Input
                id="login-dni"
                type="text"
                placeholder="87654321"
                value={loginDni}
                onChange={(e) => setLoginDni(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="login-password">Contraseña</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="cashier123"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Punto de Venta</h1>
            <p className="text-gray-600">Cajero: {user.name || user.dni}</p>
          </div>
          <Button variant="outline" onClick={() => useAuthStore.getState().logout()}>
            Cerrar Sesión
          </Button>
        </div>

        <form onSubmit={handleAddPoints} className="space-y-6">
          <div>
            <Label htmlFor="dni" className="text-lg">
              DNI del Cliente
            </Label>
            <Input
              id="dni"
              type="text"
              placeholder="Ej: 11223344"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="h-14 text-xl"
              required
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="saleCode" className="text-lg">
              Código de Venta
            </Label>
            <Input
              id="saleCode"
              type="text"
              placeholder="Ej: SALE001"
              value={saleCode}
              onChange={(e) => setSaleCode(e.target.value)}
              className="h-14 text-xl"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {result && (
            <div
              className={`border px-4 py-3 rounded ${
                result.rewardReached
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <p className="font-bold text-lg">{result.message}</p>
              <div className="mt-2 space-y-1 text-sm">
                <p>Cliente: {result.client.name || result.client.dni}</p>
                <p>Puntos actuales: {result.client.currentPoints}</p>
                <p>Total acumulado: {result.client.totalAccumulated}</p>
                {result.client.status === 'PENDING' && (
                  <p className="text-orange-600 font-semibold">
                    ⚠️ Cliente pendiente de completar registro
                  </p>
                )}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full h-14 text-xl" disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Agregar Puntos'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
