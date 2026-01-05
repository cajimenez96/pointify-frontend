'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Pointify</h1>
          <p className="text-gray-600">Sistema de Lealtad para Comercios</p>
        </div>
        
        <div className="space-y-4">
          <Link href="/pos" className="block">
            <Button className="w-full h-14 text-lg" size="lg">
              🛒 Punto de Venta (Cajero)
            </Button>
          </Link>
          
          <Link href="/check" className="block">
            <Button className="w-full h-14 text-lg" variant="outline" size="lg">
              📱 Consultar Puntos (Cliente)
            </Button>
          </Link>
          
          <Link href="/admin/dashboard" className="block">
            <Button className="w-full h-14 text-lg" variant="secondary" size="lg">
              ⚙️ Panel Admin
            </Button>
          </Link>
        </div>
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Selecciona una opción para continuar
          </p>
        </div>
      </Card>
    </div>
  );
}

