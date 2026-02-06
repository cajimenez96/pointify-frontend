"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { CompanyQR } from "@/components/shared/CompanyQR";
import apiClient from "@/lib/api-client";

interface DashboardStats {
  totalClients: number;
  totalTransactions: number;
  totalPointsIssued: number;
}

interface Settings {
  pointsTarget: number;
  rewardName: string;
  maxWinners: number;
  currentWinners: number;
  campaignStartDate: string | null;
  campaignEndDate: string | null;
  isActive: boolean;
}

interface Client {
  status: string;
  currentPoints: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, settingsRes, clientsRes] = await Promise.all([
          apiClient.get("/dashboard/stats"),
          apiClient.get("/settings"),
          apiClient.get("/clients"),
        ]);

        setStats(statsRes.data);
        setSettings(settingsRes.data);
        setClients(clientsRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  const activeClients = clients.filter((c) => c.status === "ACTIVE").length;
  const shadowClients = clients.filter((c) => c.status === "PENDING").length;
  const conversionRate =
    clients.length > 0 ? (activeClients / clients.length) * 100 : 0;

  const stockPercentage = settings?.maxWinners
    ? (settings.currentWinners / settings.maxWinners) * 100
    : 0;

  const getDaysRemaining = () => {
    if (!settings?.campaignEndDate) return null;
    const end = new Date(settings.campaignEndDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Monitoreo en tiempo real de tu campaña de lealtad
        </p>
      </div>

      {/* Estado de Campaña y QR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Estado de Campaña
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {settings?.rewardName}
              </p>
            </div>
            <Badge
              variant={settings?.isActive ? "default" : "secondary"}
              className="text-lg px-4 py-2"
            >
              {settings?.isActive ? "✅ Activa" : "❌ Inactiva"}
            </Badge>
          </div>

          {daysRemaining !== null && (
            <div className="mt-4 text-sm text-gray-600">
              <p>
                {daysRemaining > 0
                  ? `⏰ Faltan ${daysRemaining} días para finalizar`
                  : daysRemaining === 0
                    ? "⏰ ¡Último día de campaña!"
                    : "⚠️ Campaña finalizada"}
              </p>
            </div>
          )}
        </Card>

        {/* QR de Acceso */}
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Vista Pública</h3>
          <CompanyQRWrapper />
        </Card>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stock de Premios */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Stock de Premios
          </h3>
          {settings?.maxWinners === 0 ? (
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {settings?.currentWinners}
              </p>
              <p className="text-sm text-green-600 mt-1">∞ Ilimitados</p>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold text-gray-900">
                  {settings?.currentWinners}
                </p>
                <p className="text-xl text-gray-500">
                  / {settings?.maxWinners}
                </p>
              </div>
              <Progress value={stockPercentage} className="mt-3" />
              <p className="text-sm text-gray-600 mt-2">
                {stockPercentage >= 100 ? (
                  <span className="text-red-600 font-semibold">
                    ⚠️ Stock agotado
                  </span>
                ) : stockPercentage >= 80 ? (
                  <span className="text-orange-600 font-semibold">
                    ⚠️ Stock bajo
                  </span>
                ) : (
                  `${(100 - stockPercentage).toFixed(0)}% disponible`
                )}
              </p>
            </div>
          )}
        </Card>

        {/* Conversión de Usuarios */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Conversión de Usuarios
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {conversionRate.toFixed(0)}%
          </p>
          <div className="mt-3 space-y-1 text-sm">
            <p className="text-green-600">✓ Activos: {activeClients}</p>
            <p className="text-yellow-600">⏳ Pendientes: {shadowClients}</p>
          </div>
        </Card>

        {/* Total de Transacciones */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Total Transacciones
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalTransactions || 0}
          </p>
          <p className="text-sm text-gray-600 mt-3">
            Promedio:{" "}
            {stats?.totalTransactions && clients.length > 0
              ? (stats.totalTransactions / clients.length).toFixed(1)
              : 0}{" "}
            por cliente
          </p>
        </Card>

        {/* Puntos Emitidos */}
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Puntos Emitidos
          </h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats?.totalPointsIssued || 0}
          </p>
          <p className="text-sm text-gray-600 mt-3">
            Meta: {settings?.pointsTarget} puntos por premio
          </p>
        </Card>
      </div>

      {/* Resumen de Clientes */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Resumen de Clientes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Clientes</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {clients.length}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Clientes Activos</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {activeClients}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600">Shadow Users</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">
              {shadowClients}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CompanyQRWrapper() {
  const { user } = useAuthStore();
  const [showQR, setShowQR] = useState(false);

  if (!user?.companyCode) return null;

  return (
    <>
      <Button variant="outline" onClick={() => setShowQR(true)}>
        <QrCode className="h-4 w-4 mr-2" />
        Ver QR de Acceso
      </Button>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <CompanyQR
            companyCode={user.companyCode}
            companyName={user.companyName}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
