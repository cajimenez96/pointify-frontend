'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api, { getErrorMessage } from '@/services/api';
import type { DashboardStats } from '@/types/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
   const [loading, setLoading] = useState(true);

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
      loadStats();
    }
  }, [user, isLoading, router]);

  const loadStats = async () => {
    try {
      const response = await api.get<DashboardStats>('/dashboard/stats');
      setStats(response.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-4 md:p-6 2xl:p-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Panel de Control
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Bienvenido, {user?.name}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5 mb-6">
        {/* Total Clientes */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Clientes
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalClients}
              </h3>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <span className="text-3xl">👥</span>
            </div>
          </div>
        </div>

        {/* Total Transacciones */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Transacciones
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalTransactions}
              </h3>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <span className="text-3xl">💳</span>
            </div>
          </div>
        </div>

        {/* Puntos Emitidos */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Puntos Emitidos
              </p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalPointsIssued}
              </h3>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
              <span className="text-3xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Transacciones Recientes
          </h2>
        </div>
        <div className="p-6">
          {stats.recentTransactions.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No hay transacciones registradas
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Cliente
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Código Venta
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Puntos
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="border-b border-gray-100 dark:border-gray-800"
                    >
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        {typeof transaction.clientId === 'object'
                          ? transaction.clientId.name
                          : 'N/A'}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400 font-mono">
                        {transaction.saleCode}
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                          +{transaction.pointsAdded}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
