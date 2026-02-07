"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserFilters } from "./components/UserFilters";
import { UsersTable } from "./components/UsersTable";
import { UserFormDialog } from "./components/UserFormDialog";
import { useUsersQuery } from "./hooks/useUsers";
import type {
  QueryUsersDto,
  UserResponse,
} from "@/repositories/superadmin/users/types";

export default function UsersPage() {
  const [filters, setFilters] = useState<QueryUsersDto>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | undefined>(
    undefined,
  );

  const hasFilters = Object.keys(filters).length > 0;
  const { data, isLoading, error } = useUsersQuery(filters);

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setSelectedUser(undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-slate-400">
              Administra los usuarios del sistema
            </p>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        </div>

        {/* Filters */}
        <UserFilters onFilterChange={setFilters} isLoading={isLoading} />

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400">
              Error al cargar usuarios. Por favor intenta nuevamente.
            </p>
          </div>
        )}

        {/* No Filters State */}
        {!hasFilters && !isLoading && (
          <Card className="p-12 bg-slate-800/50 border-slate-700">
            <div className="text-center">
              <div className="text-slate-400 mb-2">
                👆 Selecciona al menos un filtro para ver usuarios
              </div>
              <p className="text-sm text-slate-500">
                Recomendado: Filtrar por empresa para ver todos sus usuarios
              </p>
            </div>
          </Card>
        )}

        {/* Users Table */}
        {hasFilters && (
          <UsersTable
            users={data?.data ?? []}
            pagination={data?.pagination}
            isLoading={isLoading}
            onEditUser={handleEditUser}
          />
        )}

        {/* Create Dialog */}
        <UserFormDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          mode="create"
        />

        {/* Edit Dialog */}
        <UserFormDialog
          open={isEditDialogOpen}
          onOpenChange={handleCloseEditDialog}
          mode="edit"
          userData={selectedUser}
        />
      </div>
    </div>
  );
}
