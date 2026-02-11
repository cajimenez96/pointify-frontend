import { Card } from "@/components/ui/card";
import { UserRow } from "./UserRow";
import type {
  UserResponse,
  Pagination,
} from "@/repositories/superadmin/users/types";

interface UsersTableProps {
  users: UserResponse[];
  pagination?: Pagination;
  isLoading: boolean;
  onEditUser?: (user: UserResponse) => void;
}

export function UsersTable({
  users,
  pagination,
  isLoading,
  onEditUser,
}: UsersTableProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">Cargando usuarios...</div>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          No se encontraron usuarios
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                DNI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserRow key={user._id} user={user} onEdit={onEditUser} />
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-6 py-4 border-t bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Mostrando {users.length} de {pagination.total} usuarios
            </div>
            <div className="text-sm text-muted-foreground">
              Página {pagination.page} de {pagination.totalPages}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
