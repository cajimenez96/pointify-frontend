'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api-client';

export default function CheckPage() {
  const router = useRouter();
  const [dni, setDni] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<any>(null);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setClient(null);

    try {
      // Get client info
      const clientRes = await apiClient.get(`/clients/${dni}`);
      setClient(clientRes.data);

      // Check if Shadow User (redirect to register)
      if (clientRes.data.status === 'PENDING') {
        router.push(`/register?dni=${dni}`);
        return;
      }

      // Get settings to show points target
      const settingsRes = await apiClient.get('/settings');
      setSettings(settingsRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cliente no encontrado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-teal-100 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Consultar Puntos</h1>
          <p className="text-gray-600 mt-2">Ingresa tu DNI para ver tus puntos</p>
        </div>

        <form onSubmit={handleCheck} className="space-y-6">
          <div>
            <Label htmlFor="dni" className="text-lg">
              DNI
            </Label>
            <Input
              id="dni"
              type="text"
              placeholder="Ej: 11223344"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="h-14 text-xl text-center"
              required
              autoFocus
              inputMode="numeric"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}

          {client && settings && (
            <div className="bg-white border-2 border-green-500 rounded-lg p-6 space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Hola,</p>
                <p className="text-2xl font-bold text-gray-900">{client.name}</p>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white text-center">
                <p className="text-sm opacity-90">Puntos Actuales</p>
                <p className="text-5xl font-bold">{client.currentPoints}</p>
                <p className="text-sm opacity-90 mt-2">
                  de {settings.pointsTarget} necesarios
                </p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-teal-500 h-4 transition-all duration-500"
                  style={{
                    width: `${Math.min((client.currentPoints / settings.pointsTarget) * 100, 100)}%`,
                  }}
                ></div>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>Total Acumulado: {client.totalAccumulated} puntos</p>
                <p className="mt-1">Premio: {settings.rewardName}</p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setClient(null);
                  setDni('');
                }}
              >
                Consultar Otro DNI
              </Button>
            </div>
          )}

          {!client && (
            <Button type="submit" className="w-full h-14 text-xl" disabled={isLoading}>
              {isLoading ? 'Consultando...' : 'Consultar Puntos'}
            </Button>
          )}
        </form>
      </Card>
    </div>
  );
}
