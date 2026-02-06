/**
 * ProductsTable Component
 * Table for managing product points configuration
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Plus, Package } from "lucide-react";
import { ProductDialog } from "./ProductDialog";
import { useProducts } from "../hooks/useProducts";
import type { ProductPoints } from "@/repositories/admin/settings/types";

export function ProductsTable() {
  const { products, isLoading, deleteProductMutation } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductPoints | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (product: ProductPoints) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productName: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;

    setIsDeleting(true);
    try {
      await deleteProductMutation(productName);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center border-slate-700 bg-slate-800/50">
        <div className="inline-block h-12 w-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Package className="h-6 w-6" />
          Productos
        </h2>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <Card className="border-slate-700 bg-slate-800/50">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg mb-4">
              No hay productos configurados
            </p>
            <p className="text-slate-500 text-sm">
              Agrega productos para comenzar a otorgar puntos
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800/50">
                <TableHead className="text-slate-300">Producto</TableHead>
                <TableHead className="text-slate-300">Puntos</TableHead>
                <TableHead className="text-slate-300">Estado</TableHead>
                <TableHead className="text-slate-300 text-right">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.productName}
                  className="border-slate-700 hover:bg-slate-800/30"
                >
                  <TableCell className="font-medium text-white">
                    {product.productName}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-violet-900/30 border border-violet-700 text-violet-400 font-semibold">
                      {product.pointsValue} pts
                    </span>
                  </TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-900/30 border border-green-700 text-green-400 text-sm">
                        ✓ Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700 border border-slate-600 text-slate-400 text-sm">
                        Inactivo
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.productName)}
                        disabled={isDeleting}
                        className="border-red-700 text-red-400 hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingProduct={editingProduct}
      />
    </div>
  );
}
