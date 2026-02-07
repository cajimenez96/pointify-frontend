import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import type { UserResponse } from "@/repositories/superadmin/users/types";

interface UserRowProps {
  user: UserResponse;
  onEdit?: (user: UserResponse) => void;
}

export function UserRow({ user, onEdit }: UserRowProps) {
  const getRoleBadge = (role: string) => {
    const roleStyles = {
      superadmin: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      admin: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      cashier: "bg-green-500/20 text-green-300 border-green-500/30",
    };

    return (
      <Badge
        variant="outline"
        className={roleStyles[role as keyof typeof roleStyles]}
      >
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge
        variant="outline"
        className="bg-green-500/20 text-green-300 border-green-500/30"
      >
        Activo
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-red-500/20 text-red-300 border-red-500/30"
      >
        Inactivo
      </Badge>
    );
  };

  return (
    <tr className="border-b border-slate-700 hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="text-white font-medium">{user.username}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-slate-300">{user.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-slate-300">{user.dni}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-slate-300">
          {user.company?.businessName || "N/A"}
        </div>
        <div className="text-xs text-slate-500">
          {user.company?.companyCode || ""}
        </div>
      </td>
      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
      <td className="px-6 py-4">{getStatusBadge(user.isActive)}</td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          {onEdit && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-slate-800 border-slate-700 text-white"
              >
                <DropdownMenuItem
                  onClick={() => onEdit(user)}
                  className="hover:bg-slate-700 cursor-pointer"
                >
                  Editar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </td>
    </tr>
  );
}
