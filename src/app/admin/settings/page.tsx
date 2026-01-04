'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api, { getErrorMessage } from '@/services/api';
import type { Settings, UpdateSettingsRequest } from '@/types/api';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    pointsTarget: 10,
    rewardName: '',
    minPurchaseAmount: 0,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
      return;
    }

    if (user && user.role !== 'admin') {
      toast.error('No tienes permisos para acceder a esta página');
      router.push('/pos');
      return;
    }

    if (user) {
      loadSettings();
    }
  }, [user, isLoading, router]);

  const loadSettings = async () => {
    try {
      const response = await api.get<Settings>('/settings');
      setSettings(response.data);
      setFormData({
        pointsTarget: response.data.pointsTarget,
        rewardName: response.data.rewardName,
        minPurchaseAmount: response.data.minPurchaseAmount,
      });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const toastId = toast.loading('Guardando cambios...');

    try {
      const payload: UpdateSettingsRequest = formData;
      const response = await api.put<Settings>('/settings', payload);
      setSettings(response.data);
      toast.success('Configuración actualizada exitosamente', { id: toastId });
    } catch (err) {
      toast.error(getErrorMessage(err), { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData({
        pointsTarget: settings.pointsTarget,
        rewardName: settings.rewardName,
        minPurchaseAmount: settings.minPurchaseAmount,
      });
      toast.success('Cambios descartados');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración del Sistema
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configura las reglas del programa de lealtad
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Form */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Parámetros de Recompensas
            </h2>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Points Target */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta de Puntos <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.pointsTarget}
                  onChange={(e) =>
                    setFormData({ ...formData, pointsTarget: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  required
                  disabled={saving}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Cantidad de puntos necesarios para obtener el premio
                </p>
              </div>

              {/* Reward Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del Premio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.rewardName}
                  onChange={(e) =>
                    setFormData({ ...formData, rewardName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Café Gratis, Descuento 20%, etc."
                  required
                  disabled={saving}
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Qué recibe el cliente al alcanzar la meta
                </p>
              </div>

              {/* Min Purchase Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Monto Mínimo de Compra
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={formData.minPurchaseAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minPurchaseAmount: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="0"
                    step="0.01"
                    disabled={saving}
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Monto mínimo para que la compra otorgue puntos (0 = sin mínimo)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <LoadingButton
                  type="submit"
                  loading={saving}
                  className="flex-1"
                  variant="primary"
                >
                  Guardar Cambios
                </LoadingButton>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={saving}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Descartar
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Vista Previa
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <p className="text-sm opacity-90 mb-2">Recompensa Actual</p>
                <p className="text-3xl font-bold mb-4">{formData.rewardName || 'Sin nombre'}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>Meta</span>
                  <span className="font-semibold">{formData.pointsTarget} puntos</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <p className="text-xs opacity-75">
                    Los clientes verán esta tarjeta cuando consulten sus puntos
                  </p>
                </div>
              </div>

              {/* System Info */}
              <div className="mt-6 space-y-3">
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-1">
                    💡 Regla de Puntos
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    1 Compra = 1 Punto
                  </p>
                </div>

                {formData.minPurchaseAmount > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                      ⚠️ Monto Mínimo
                    </p>
                    <p className="text-sm text-yellow-800 dark:text-yellow-400">
                      Solo compras de ${formData.minPurchaseAmount} o más otorgan puntos
                    </p>
                  </div>
                )}

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-300 mb-1">
                    🎉 Al alcanzar la meta
                    </p>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    Los puntos se reinician a 0 y el cliente puede canjear su premio
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
