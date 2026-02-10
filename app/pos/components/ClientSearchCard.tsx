/**
 * ClientSearchCard Component
 * Shared component for DNI input and client display.
 * Handles both existing clients and new clients (exists: false).
 */

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, User, UserPlus, Wallet } from "lucide-react";
import type { ClientSearchResult } from "../types";

interface ClientSearchCardProps {
  onClientFound: (client: ClientSearchResult) => void;
  onSearch: (dni: string) => Promise<ClientSearchResult>;
  isLoading?: boolean;
}

export function ClientSearchCard({
  onClientFound,
  onSearch,
  isLoading = false,
}: ClientSearchCardProps) {
  const [dni, setDni] = useState("");
  const [client, setClient] = useState<ClientSearchResult | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (dni.length < 7) {
      setError("DNI debe tener al menos 7 dígitos");
      return;
    }

    setError("");
    try {
      const result = await onSearch(dni);
      setClient(result);
      onClientFound(result);
    } catch (err: any) {
      setError(err.message || "Error al buscar cliente");
      setClient(null);
    }
  };

  const handleClear = () => {
    setDni("");
    setClient(null);
    setError("");
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Ingresa DNI del cliente"
              value={dni}
              onChange={(e) => {
                setDni(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              maxLength={8}
              className="h-12 text-lg"
              disabled={isLoading}
            />
            {error && <p className="text-destructive text-sm mt-1">{error}</p>}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || dni.length < 7}
            className="h-12 px-6"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
        </div>

        {/* Client Display - Existing Client */}
        {client?.exists && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{client.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    DNI: {client.dni}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Wallet className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {client.currentPoints}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  puntos disponibles
                </p>
              </div>
            </div>

            {client.status === "PENDING" && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                <p className="text-yellow-700 text-sm">
                  Cliente pendiente de completar perfil
                </p>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="mt-3"
            >
              Buscar otro cliente
            </Button>
          </div>
        )}

        {/* Client Display - New Client (not found) */}
        {client && !client.exists && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Cliente nuevo</h3>
                <p className="text-muted-foreground text-sm">
                  DNI: {client.dni}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  Se registrará automáticamente al procesar la venta
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="mt-3"
            >
              Buscar otro cliente
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
