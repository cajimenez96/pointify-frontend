'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton';
import api, { getErrorMessage } from '@/services/api';
import type { AddPointsRequest, AddPointsResponse } from '@/types/api';

export default function POSPage() {
  const [dni, setDni] = useState('');
  const [saleCode, setSaleCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<AddPointsResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLastResult(null);

    const toastId = toast.loading('Procesando transacción...');

    try {
      const payload: AddPointsRequest = { dni, saleCode };
      const response = await api.post<AddPointsResponse>('/transactions/add', payload);
      const data = response.data;

      // Guardar resultado para mostrar
      setLastResult(data);

      // Cerrar toast de carga y mostrar éxito
      toast.success(data.message, { id: toastId });

      // Si alcanzó la meta, mostrar notificación especial
      if (data.rewardReached) {
        setTimeout(() => {
          toast.success(
            `🎉 ${data.client.name} puede canjear su ${data.rewardName}!`,
            {
              duration: 6000,
              icon: '🏆',
              style: {
                background: '#10B981',
                color: '#fff',
                fontSize: '16px',
                fontWeight: '600',
              },
            }
          );
        }, 500);
      }

      // Limpiar formulario
      setDni('');
      setSaleCode('');
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
      setLastResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setDni('');
    setSaleCode('');
    setLastResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Sistema de Puntos - Caja
          </h1>
          <p className="text-gray-600">
            Agrega puntos a tus clientes por cada compra realizada
          </p>
        </div>

        {/* Formulario Principal */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            <span className="text-3xl">➕</span>
            Agregar Puntos
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* DNI del Cliente */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                DNI del Cliente <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ej: 12345678"
                required
                disabled={loading}
                maxLength={8}
                autoComplete="off"
              />
              <p className="mt-1 text-sm text-gray-500">
                Ingresa el DNI del cliente que realizó la compra
              </p>
            </div>

            {/* Código de Venta */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Código de Venta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={saleCode}
                onChange={(e) => setSaleCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
                placeholder="Ej: SALE001"
                required
                disabled={loading}
                autoComplete="off"
              />
              <p className="mt-1 text-sm text-gray-500">
                Código único de la transacción
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-3 pt-2">
              <LoadingButton
                type="submit"
                loading={loading}
                className="flex-1 text-lg py-4"
                variant="primary"
              >
                ✓ Agregar Punto
              </LoadingButton>
              
              {(dni || saleCode || lastResult) && (
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={loading}
                  className="px-6 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Limpiar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Resultado de la última transacción */}
        {lastResult && (
          <div className={`rounded-xl shadow-lg p-6 ${
            lastResult.rewardReached 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-blue-50 border-2 border-blue-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                {lastResult.rewardReached ? (
                  <span className="text-5xl">🏆</span>
                ) : (
                  <span className="text-5xl">✅</span>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-2xl font-bold mb-2 ${
                  lastResult.rewardReached ? 'text-white' : 'text-gray-900'
                }`}>
                  {lastResult.rewardReached ? '¡Premio Alcanzado!' : '¡Puntos Agregados!'}
                </h3>
                
                <div className={`space-y-2 ${
                  lastResult.rewardReached ? 'text-white/90' : 'text-gray-700'
                }`}>
                  <p className="text-lg">
                    <strong>Cliente:</strong> {lastResult.client.name}
                  </p>
                  <p className="text-lg">
                    <strong>Puntos Actuales:</strong> {lastResult.client.currentPoints}
                  </p>
                  <p className="text-lg">
                    <strong>Total Acumulado:</strong> {lastResult.client.totalAccumulated}
                  </p>
                  
                  {lastResult.rewardReached && (
                    <div className="mt-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                      <p className="text-xl font-bold">
                        🎁 Puede canjear: {lastResult.rewardName}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Instrucciones de uso */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            Instrucciones de Uso
          </h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Solicita el DNI del cliente que realizó la compra</li>
            <li>• Ingresa el código único de la venta actual</li>
            <li>• Si el cliente alcanzó la meta, se mostrará una alerta especial</li>
            <li>• El sistema previene duplicados del mismo código de venta</li>
            <li>• Cada compra = 1 punto agregado automáticamente</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
