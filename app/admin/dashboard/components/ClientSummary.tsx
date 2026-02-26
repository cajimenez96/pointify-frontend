/**
 * ClientSummary - Client counts breakdown card
 */

import { Card } from "@/components/ui/card";

interface ClientSummaryProps {
  totalClients: number;
  activeClients: number;
  shadowClients: number;
}

export function ClientSummary({
  totalClients,
  activeClients,
  shadowClients,
}: ClientSummaryProps) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Resumen de Clientes
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-4 bg-violet-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Clientes</p>
          <p className="text-4xl font-bold text-violet-600 mt-2">
            {totalClients}
          </p>
        </div>
        <div className="text-center p-4 bg-emerald-50 rounded-lg">
          <p className="text-sm text-gray-600">Clientes Activos</p>
          <p className="text-4xl font-bold text-emerald-600 mt-2">
            {activeClients}
          </p>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-lg">
          <p className="text-sm text-gray-600">Shadow Users</p>
          <p className="text-4xl font-bold text-amber-600 mt-2">
            {shadowClients}
          </p>
        </div>
      </div>
    </Card>
  );
}
