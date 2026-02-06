/**
 * ClientSearchCard Component
 * Shared component for DNI input and client display
 */

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, User, Wallet } from "lucide-react";
import type { ClientSummary } from "@/repositories/admin/transactions/types";

interface ClientSearchCardProps {
  onClientFound: (client: ClientSummary) => void;
  onSearchDni: (dni: string) => Promise<ClientSummary>;
  isLoading?: boolean;
}

export function ClientSearchCard({
  onClientFound,
  onSearchDni,
  isLoading = false,
}: ClientSearchCardProps) {
  const [dni, setDni] = useState("");
  const [client, setClient] = useState<ClientSummary | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (dni.length < 7) {
      setError("DNI debe tener al menos 7 dígitos");
      return;
    }

    setError("");
    try {
      const foundClient = await onSearchDni(dni);
      setClient(foundClient);
      onClientFound(foundClient);
    } catch (err: any) {
      setError(err.message || "Cliente no encontrado");
      setClient(null);
    }
  };

  const handleClear = () => {
    setDni("");
    setClient(null);
    setError("");
  };

  return (
    <Card className="p-6 border-slate-700 bg-slate-800/50">
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
              className="h-12 text-lg bg-slate-900 border-slate-600 text-white"
              disabled={isLoading}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>
          <Button
            onClick={handleSearch}
            disabled={isLoading || dni.length < 7}
            className="h-12 px-6 bg-violet-600 hover:bg-violet-700"
          >
            <Search className="h-5 w-5 mr-2" />
            Buscar
          </Button>
        </div>

        {/* Client Display */}
        {client && (
          <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-700 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-violet-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-lg">
                    {client.name}
                  </h3>
                  <p className="text-slate-400 text-sm">DNI: {client.dni}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <Wallet className="h-5 w-5 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">
                    {client.currentPoints}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">puntos disponibles</p>
              </div>
            </div>

            {client.status === "PENDING" && (
              <div className="mt-3 bg-yellow-900/30 border border-yellow-700 rounded px-3 py-2">
                <p className="text-yellow-400 text-sm">
                  ⚠️ Cliente pendiente de completar perfil
                </p>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="mt-3 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Buscar otro cliente
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
