'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import apiClient from '@/lib/api-client';

interface Client {
  _id: string;
  dni: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  currentPoints: number;
  totalAccumulated: number;
  createdAt: string;
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await apiClient.get('/clients');
        setClients(res.data);
        setFilteredClients(res.data);
      } catch (error) {
        console.error('Error al cargar clientes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    let result = clients;

    // Filtrar por búsqueda
    if (searchTerm) {
      result = result.filter(
        (client) =>
          client.dni.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (filterStatus !== 'ALL') {
      result = result.filter((client) => client.status === filterStatus);
    }

    setFilteredClients(result);
  }, [searchTerm, filterStatus, clients]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  const activeCount = clients.filter((c) => c.status === 'ACTIVE').length;
  const pendingCount = clients.filter((c) => c.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-600 mt-1">
          Administra y visualiza todos los clientes del programa de lealtad
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Clientes</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{clients.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Clientes Activos</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{activeCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pendientes de Registro</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingCount}</p>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="🔍 Buscar por DNI, nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
         <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterStatus('ACTIVE')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'ACTIVE'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'PENDING'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pendientes
            </button>
          </div>
        </div>
      </Card>

      {/* Tabla de Clientes */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DNI</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Puntos</TableHead>
                <TableHead className="text-right">Total Acum.</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No se encontraron clientes
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell className="font-mono font-medium">{client.dni}</TableCell>
                    <TableCell>
                      {client.name || (
                        <span className="text-gray-400 italic">Sin nombre</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.email || (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.phone || (
                        <span className="text-gray-400 italic">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {client.currentPoints}
                    </TableCell>
                    <TableCell className="text-right text-gray-600">
                      {client.totalAccumulated}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={client.status === 'ACTIVE' ? 'default' : 'secondary'}
                        className={
                          client.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }
                      >
                        {client.status === 'ACTIVE' ? '✓ ACTIVO' : '⏳ PENDIENTE'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(client.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Info */}
      {filteredClients.length > 0 && (
        <p className="text-sm text-gray-600 text-center">
          Mostrando {filteredClients.length} de {clients.length} clientes
        </p>
      )}
    </div>
  );
}
