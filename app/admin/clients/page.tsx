"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/common/Container";
import { useClients } from "./hooks/useClients";
import { ClientsStats } from "./components/ClientsStats";
import { ClientsFilters } from "./components/ClientsFilters";
import { ClientsTable } from "./components/ClientsTable";

export default function ClientsPage() {
  const { clients, isLoading } = useClients();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // Derive filtered clients based on search and status
  const filteredClients = useMemo(() => {
    let result = clients;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (client) =>
          client.dni.toLowerCase().includes(term) ||
          client.name.toLowerCase().includes(term) ||
          (client.email && client.email.toLowerCase().includes(term)),
      );
    }

    // Filter by status
    if (filterStatus !== "ALL") {
      result = result.filter((client) => client.status === filterStatus);
    }

    return result;
  }, [clients, searchTerm, filterStatus]);

  // Compute stats from full list (not filtered)
  const stats = useMemo(() => {
    return {
      total: clients.length,
      active: clients.filter((c) => c.status === "ACTIVE").length,
      pending: clients.filter((c) => c.status === "PENDING").length,
    };
  }, [clients]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Clientes
        </h1>
        <p className="text-gray-600 mt-1">
          Administra y visualiza todos los clientes del programa de lealtad
        </p>
      </div>

      {/* Stats Cards */}
      <ClientsStats
        total={stats.total}
        active={stats.active}
        pending={stats.pending}
      />

      {/* Main Content: Filters + Table */}
      <Container
        header={
          <ClientsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
          />
        }
      >
        <ClientsTable clients={filteredClients} isLoading={isLoading} />
      </Container>
    </div>
  );
}
