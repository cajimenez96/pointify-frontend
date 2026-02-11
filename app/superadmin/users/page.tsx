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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground">
            Administra los usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Filters */}
      <UserFilters onFilterChange={setFilters} isLoading={isLoading} />

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">
            Error al cargar usuarios. Por favor intenta nuevamente.
          </p>
        </div>
      )}

      {/* No Filters State */}
      {!hasFilters && !isLoading && (
        <Card className="p-12">
          <div className="text-center">
            <div className="text-muted-foreground mb-2">
              👆 Selecciona al menos un filtro para ver usuarios
            </div>
            <p className="text-sm text-muted-foreground">
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
  );
}
