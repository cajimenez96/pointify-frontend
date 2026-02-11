"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CompanyFilters } from "./components/CompanyFilters";
import { CompaniesTable } from "./components/CompaniesTable";
import { CompanyFormDialog } from "./components/CompanyFormDialog";
import { useCompaniesQuery } from "./hooks/useCompanies";
import type {
  Company,
  QueryCompaniesDto,
} from "@/repositories/superadmin/companies/types";

interface DialogState {
  open: boolean;
  mode: "create" | "edit";
  company?: Company;
}

export default function CompaniesPage() {
  const [filters, setFilters] = useState<QueryCompaniesDto>({});
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    mode: "create",
  });

  // Fetch companies with TanStack Query
  const { data, isLoading, error } = useCompaniesQuery(filters);

  const handleCreateClick = () => {
    setDialogState({
      open: true,
      mode: "create",
      company: undefined,
    });
  };

  const handleEdit = (company: Company) => {
    setDialogState({
      open: true,
      mode: "edit",
      company,
    });
  };

  const handleDialogChange = (open: boolean) => {
    setDialogState((prev) => ({ ...prev, open }));
  };

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">
            {error instanceof Error
              ? error.message
              : "Error al cargar empresas"}
          </p>
          <Button onClick={() => window.location.reload()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Empresas</h1>
          <p className="text-muted-foreground">
            Gestiona todas las empresas del sistema
          </p>
        </div>

        <Button onClick={handleCreateClick}>
          + Nueva Empresa
        </Button>
      </div>

      {/* Filtros */}
      <CompanyFilters onFilterChange={setFilters} isLoading={isLoading} />

      {/* Tabla */}
      <CompaniesTable
        companies={data?.data ?? []}
        pagination={data?.pagination}
        isLoading={isLoading}
        onEdit={handleEdit}
      />

      {/* Dialog para Crear/Editar */}
      <CompanyFormDialog
        mode={dialogState.mode}
        company={dialogState.company}
        open={dialogState.open}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
}
