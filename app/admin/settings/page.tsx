"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Gift } from "lucide-react";
import { ProductsTable } from "./components/ProductsTable";
import { RewardsGrid } from "./components/RewardsGrid";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">
          Gestiona productos y premios del catálogo
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="w-full flex gap-2">
          <TabsTrigger value="products" className="flex-1 h-10">
            <Package className="h-4 w-4 mr-2" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="rewards" className="flex-1 h-10">
            <Gift className="h-4 w-4 mr-2" />
            Premios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-6">
          <ProductsTable />
        </TabsContent>

        <TabsContent value="rewards" className="mt-6">
          <RewardsGrid />
        </TabsContent>
      </Tabs>
    </div>
  );
}
