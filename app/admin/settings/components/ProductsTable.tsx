"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Container } from "@/components/common/Container";

export function ProductsTable() {
  const { products, isLoading, deleteProduct, isDeleting } = useProducts();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductPoints | null>(
    null,
  );

  const handleEdit = (product: ProductPoints) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productName: string) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    await deleteProduct(productName);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center">
        <div className="inline-block h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Configuración de Productos
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Define los productos de tu negocio y cuántos puntos otorga cada uno
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      <Container>
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">
              No hay productos configurados
            </p>
            <p className="text-gray-400 text-sm">
              Agrega productos para comenzar a otorgar puntos
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Puntos</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productName}>
                  <TableCell className="font-medium">
                    {product.productName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-semibold">
                      {product.pointsValue} pts
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.isActive ? (
                      <Badge variant="default">Activo</Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.productName)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
      </Container>

      <ProductDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        editingProduct={editingProduct}
      />
    </div>
  );
}
