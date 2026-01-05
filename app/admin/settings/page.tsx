'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import apiClient from '@/lib/api-client';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [formData, setFormData] = useState({
    rewardName: '',
    pointsTarget: 10,
    maxWinners: 0,
    campaignStartDate: '',
    campaignEndDate: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await apiClient.get('/settings');
        const data = res.data;
        
        setFormData({
          rewardName: data.rewardName || '',
          pointsTarget: data.pointsTarget || 10,
          maxWinners: data.maxWinners || 0,
          campaignStartDate: data.campaignStartDate
            ? new Date(data.campaignStartDate).toISOString().split('T')[0]
            : '',
          campaignEndDate: data.campaignEndDate
            ? new Date(data.campaignEndDate).toISOString().split('T')[0]
            : '',
          isActive: data.isActive ?? true,
        });
      } catch (error) {
        console.error('Error al cargar configuración:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload: any = {
        rewardName: formData.rewardName,
        pointsTarget: Number(formData.pointsTarget),
        maxWinners: Number(formData.maxWinners),
        isActive: formData.isActive,
      };

      // Solo enviar fechas si están definidas
      if (formData.campaignStartDate) {
        payload.campaignStartDate = new Date(formData.campaignStartDate).toISOString();
      }
      if (formData.campaignEndDate) {
        payload.campaignEndDate = new Date(formData.campaignEndDate).toISOString();
      }

      await apiClient.put('/settings', payload);
      
      setMessage({ type: 'success', text: '✅ Configuración guardada exitosamente' });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error al guardar configuración',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando configuración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración de Campaña</h1>
        <p className="text-gray-600 mt-1">Administra los parámetros de tu programa de lealtad</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre del Premio */}
          <div>
            <Label htmlFor="rewardName">Nombre del Premio *</Label>
            <Input
              id="rewardName"
              type="text"
              placeholder="Ej: Café Gratis, Descuento 50%"
              value={formData.rewardName}
              onChange={(e) => setFormData({ ...formData, rewardName: e.target.value })}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Este es el premio que recibirán los clientes al completar la meta
            </p>
          </div>

          {/* Meta de Puntos */}
          <div>
            <Label htmlFor="pointsTarget">Meta de Puntos *</Label>
            <Input
              id="pointsTarget"
              type="number"
              min="1"
              value={formData.pointsTarget}
              onChange={(e) => setFormData({ ...formData, pointsTarget: Number(e.target.value) })}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Cantidad de puntos necesarios para ganar el premio
            </p>
          </div>

          {/* Stock de Ganadores */}
          <div>
            <Label htmlFor="maxWinners">Stock de Ganadores</Label>
            <Input
              id="maxWinners"
              type="number"
              min="0"
              value={formData.maxWinners}
              onChange={(e) => setFormData({ ...formData, maxWinners: Number(e.target.value) })}
            />
            <p className="text-sm text-gray-500 mt-1">
              Máximo de premios disponibles. <strong>0 = ilimitados</strong>
            </p>
          </div>

          {/* Fechas de Campaña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaignStartDate">Fecha de Inicio (opcional)</Label>
              <Input
                id="campaignStartDate"
                type="date"
                value={formData.campaignStartDate}
                onChange={(e) => setFormData({ ...formData, campaignStartDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="campaignEndDate">Fecha de Fin (opcional)</Label>
              <Input
                id="campaignEndDate"
                type="date"
                value={formData.campaignEndDate}
                onChange={(e) => setFormData({ ...formData, campaignEndDate: e.target.value })}
              />
            </div>
          </div>

          {/* Campaña Activa */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="isActive" className="text-base font-semibold">
                Campaña Activa
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                Permite que los cajeros agreguen puntos a los clientes
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Mensaje de Feedback */}
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? 'Guardando...' : '💾 Guardar Cambios'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
              disabled={isSaving}
            >
              ↻ Cancelar
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Consejos</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Si estableces fechas de campaña, el sistema solo permitirá transacciones dentro de ese rango</li>
          <li>• El stock de ganadores te permite controlar cuántos premios puedes otorgar</li>
          <li>• Puedes desactivar temporalmente la campaña sin cambiar la configuración</li>
        </ul>
      </Card>
    </div>
  );
}
