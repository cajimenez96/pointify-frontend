'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api, { getErrorMessage } from '@/services/api';
import type { Client } from '@/types/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CustomersPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      loadClients();
    }
  }, [user, isLoading, router]);

  const loadClients = async () => {
    try {
      const response = await api.get<Client[]>('/clients');
      setClients(response.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.dni.includes(searchTerm)
  );

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
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Clientes
        </h1>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o DNI..."
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mb-6">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Clientes</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {clients.length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Clientes Activos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {clients.filter((c) => c.isActive).length}
          </p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Puntos Activos</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {clients.reduce((sum, c) => sum + c.currentPoints, 0)}
          </p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Lista de Clientes
          </h2>
        </div>
        <div className="p-6">
          {filteredClients.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      DNI
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Nombre
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Teléfono
                    </th>
                    <th className="pb-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Email
                    </th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Puntos
                    </th>
                    <th className="pb-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Total Acum.
                    </th>
                    <th className="pb-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Estado
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr
                      key={client._id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <td className="py-3 text-sm font-mono text-gray-900 dark:text-white">
                        {client.dni}
                      </td>
                      <td className="py-3 text-sm text-gray-900 dark:text-white">
                        {client.name}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {client.phone || '-'}
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">
                        {client.email || '-'}
                      </td>
                      <td className="py-3 text-right">
                        <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                          {client.currentPoints}
                        </span>
                      </td>
                      <td className="py-3 text-right text-sm text-gray-600 dark:text-gray-400">
                        {client.totalAccumulated}
                      </td>
                      <td className="py-3 text-center">
                        {client.isActive ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                            Activo
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:text-red-300">
                            Inactivo
                          </span>
                        )}
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
