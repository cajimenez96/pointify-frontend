/**
 * Admin Settings Page - Redesigned
 * Catalog Manager: Products and Rewards configuration
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Package, Gift, Settings as SettingsIcon } from "lucide-react";
import { ProductsTable } from "./components/ProductsTable";
import { RewardsGrid } from "./components/RewardsGrid";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Configuración de Campaña
            </h1>
            <p className="text-slate-400">
              Gestiona productos y premios del catálogo
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-800 border border-slate-700">
            <TabsTrigger
              value="products"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Package className="h-5 w-5 mr-2" />
              Productos
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
            >
              <Gift className="h-5 w-5 mr-2" />
              Premios
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card className="p-6 border-slate-700 bg-slate-800/50">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Configuración de Productos
                </h2>
                <p className="text-slate-400 text-sm">
                  Define los productos de tu negocio y cuántos puntos otorga
                  cada uno. Estos productos estarán disponibles en el POS para
                  registrar ventas.
                </p>
              </div>
              <ProductsTable />
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card className="p-6 border-slate-700 bg-slate-800/50">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Catálogo de Premios
                </h2>
                <p className="text-slate-400 text-sm">
                  Crea premios que los clientes pueden canjear con sus puntos.
                  Gestiona el stock y los costos de cada premio.
                </p>
              </div>
              <RewardsGrid />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
