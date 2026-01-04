'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import LoadingButton from '@/components/LoadingButton';
import api, { getErrorMessage } from '@/services/api';
import type { Client, CreateClientRequest, Settings } from '@/types/api';

type Step = 'input' | 'display' | 'register';

export default function PortalPage() {
  const [step, setStep] = useState<Step>('input');
  const [dni, setDni] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<Client | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const handleCheckDni = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Consultando información...');

    try {
      // Consultar cliente y configuración en paralelo
      const [clientRes, settingsRes] = await Promise.all([
        api.get<Client>(`/clients/${dni}`),
        api.get<Settings>('/settings'),
      ]);

      setClient(clientRes.data);
      setSettings(settingsRes.data);
      setStep('display');
      toast.success('¡Información encontrada!', { id: toastId });
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Cliente no registrado, mostrar formulario de registro
        setStep('register');
        toast.error('DNI no registrado. Por favor, completa el formulario.', { id: toastId });
        
        // Cargar settings para tener la info del premio
        try {
          const settingsRes = await api.get<Settings>('/settings');
          setSettings(settingsRes.data);
        } catch (e) {
          console.error('Error al cargar configuración:', e);
        }
      } else {
        const errorMessage = getErrorMessage(err);
        toast.error(errorMessage, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading('Registrando cliente...');

    try {
      const payload: CreateClientRequest = {
        dni,
        ...formData,
      };

      await api.post('/clients', payload);

      // Después de registrar, obtener la información completa
      const [clientRes, settingsRes] = await Promise.all([
        api.get<Client>(`/clients/${dni}`),
        api.get<Settings>('/settings'),
      ]);

      setClient(clientRes.data);
      setSettings(settingsRes.data);
      setStep('display');

      toast.success('¡Bienvenido! Te has registrado exitosamente.', { id: toastId, duration: 5000 });
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const resetPortal = () => {
    setStep('input');
    setClient(null);
    setSettings(null);
    setDni('');
    setFormData({ name: '', phone: '', email: '' });
  };

  // Calcular progreso hacia el premio
  const progress = client && settings
    ? (client.currentPoints / settings.pointsTarget) * 100
    : 0;

  const pointsRemaining = client && settings
    ? Math.max(0, settings.pointsTarget - client.currentPoints)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Logo o Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-full p-4 shadow-lg mb-4">
            <span className="text-5xl">🏆</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Pointify
          </h1>
          <p className="text-white/90">
            Programa de Lealtad
          </p>
        </div>

        {/* STEP 1: Consultar DNI */}
        {step === 'input' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Consulta tus Puntos
            </h2>
            <p className="text-center text-gray-600 mb-6">
              Ingresa tu DNI para ver cuántos puntos has acumulado
            </p>

            <form onSubmit={handleCheckDni}>
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-4 text-xl text-center border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-4 font-bold"
                placeholder="Tu DNI"
                required
                disabled={loading}
                maxLength={8}
                autoComplete="off"
              />

              <LoadingButton
                type="submit"
                loading={loading}
                className="w-full text-lg py-4"
              >
                👀 Ver mis Puntos
              </LoadingButton>
            </form>
          </div>
        )}

        {/* STEP 2: Mostrar Puntos */}
        {step === 'display' && client && settings && (
          <div className="space-y-6 animate-fadeIn">
            {/* Tarjeta de Puntos */}
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  ¡Hola, {client.name}!
                </h2>
                <p className="text-gray-500">DNI: {client.dni}</p>
              </div>

              {/* Display de Puntos */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6 shadow-lg">
                <p className="text-sm opacity-90 mb-2">Puntos Actuales</p>
                <p className="text-6xl font-bold mb-4">{client.currentPoints}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="opacity-90">Meta</span>
                  <span className="font-semibold">{settings.pointsTarget} pts</span>
                </div>
              </div>

              {/* Barra de Progreso */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2 text-gray-700 font-semibold">
                  <span>Progreso hacia {settings.rewardName}</span>
                  <span>{Math.min(progress, 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  >
                    {progress >= 20 && (
                      <span className="text-white text-xs font-bold">
                        {Math.min(progress, 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Mensaje de Progreso */}
                <div className="mt-4 text-center">
                  {pointsRemaining > 0 ? (
                    <p className="text-gray-700 font-medium">
                      ✨ ¡Te faltan <span className="text-blue-600 font-bold">{pointsRemaining}</span> puntos para tu {settings.rewardName}!
                    </p>
                  ) : (
                    <div className="bg-green-100 border-2 border-green-500 rounded-lg p-4">
                      <p className="text-green-800 font-bold text-lg">
                        🎉 ¡Premio listo para canjear!
                      </p>
                      <p className="text-green-700 text-sm mt-1">
                        Acércate a la tienda para reclamar tu {settings.rewardName}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Estadísticas Adicionales */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm mb-1">Total Acumulado</p>
                  <p className="text-2xl font-bold text-gray-800">{client.totalAccumulated}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm mb-1">Compras Totales</p>
                  <p className="text-2xl font-bold text-gray-800">{client.totalAccumulated}</p>
                </div>
              </div>

              {/* Botón para nueva consulta */}
              <button
                onClick={resetPortal}
                className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                ← Consultar otro DNI
              </button>
            </div>

            {/* Info de Contacto */}
            {(client.phone || client.email) && (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 text-sm text-gray-700">
                <p className="font-semibold mb-2">📞 Tus datos de contacto:</p>
                {client.phone && <p>• Teléfono: {client.phone}</p>}
                {client.email && <p>• Email: {client.email}</p>}
              </div>
            )}
          </div>
        )}

        {/* STEP 3: Formulario de Registro */}
        {step === 'register' && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              ¡Únete al Programa!
            </h2>
            <p className="text-gray-600 mb-6">
              DNI <strong>{dni}</strong> no encontrado. Regístrate ahora y empieza a acumular puntos:
            </p>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <input
                  type="tel"
                  placeholder="Ej: 555-1234"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  placeholder="Ej: juan@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {settings && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <p className="font-semibold mb-1">🎁 Beneficio:</p>
                  <p>Junta {settings.pointsTarget} puntos y obtén <strong>{settings.rewardName}</strong> gratis!</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <LoadingButton
                  type="submit"
                  loading={loading}
                  className="flex-1"
                >
                  ✓ Registrarme
                </LoadingButton>

                <button
                  type="button"
                  onClick={resetPortal}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>¿Tienes problemas? Contacta a nuestro equipo</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
