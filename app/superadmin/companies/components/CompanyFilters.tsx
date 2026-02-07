import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QueryCompaniesDto } from "@/repositories/superadmin/companies/types";

interface CompanyFiltersProps {
  onFilterChange: (filters: QueryCompaniesDto) => void;
  isLoading?: boolean;
}

export function CompanyFilters({
  onFilterChange,
  isLoading = false,
}: CompanyFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleFilter = () => {
    onFilterChange({
      businessName: searchQuery || undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      page: 1,
    });
  };

  const handleClear = () => {
    setSearchQuery("");
    setStatusFilter("all");
    onFilterChange({
      businessName: undefined,
      isActive: undefined,
      page: 1,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700 p-4">
      <div className="flex gap-4 items-end">
        {/* Búsqueda */}
        <div className="flex-1">
          <Label className="text-slate-200 mb-2 block">Buscar Empresa</Label>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Código o nombre de empresa..."
            className="bg-slate-700 border-slate-600 text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilter();
              }
            }}
          />
        </div>

        {/* Estado */}
        <div className="w-[200px]">
          <Label className="text-slate-200 mb-2 block">Estado</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activas</SelectItem>
              <SelectItem value="inactive">Inactivas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={handleFilter}
            className="bg-violet-600 hover:bg-violet-700"
            disabled={isLoading}
          >
            Filtrar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
            disabled={isLoading}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </Card>
  );
}
