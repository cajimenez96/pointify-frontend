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
      <Card className="p-8 bg-slate-800/50 border-slate-700">
        <div className="text-center text-slate-400">Cargando usuarios...</div>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card className="p-8 bg-slate-800/50 border-slate-700">
        <div className="text-center text-slate-400">
          No se encontraron usuarios
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-slate-800/50 border-slate-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/50 border-b border-slate-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                DNI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Empresa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
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
        <div className="px-6 py-4 border-t border-slate-700 bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">
              Mostrando {users.length} de {pagination.total} usuarios
            </div>
            <div className="text-sm text-slate-400">
              Página {pagination.page} de {pagination.totalPages}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
