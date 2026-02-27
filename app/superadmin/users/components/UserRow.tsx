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
      superadmin: "bg-purple-100 text-purple-700 border-purple-200",
      admin: "bg-blue-100 text-blue-700 border-blue-200",
      cashier: "bg-green-100 text-green-700 border-green-200",
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
        className="bg-green-100 text-green-700 border-green-200"
      >
        Activo
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-700 border-red-200"
      >
        Inactivo
      </Badge>
    );
  };

  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="px-6 py-4">
        <div className="text-foreground font-medium">{user.username}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-foreground">{user.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-foreground">{user.dni}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-foreground">
          {user.company?.businessName || "N/A"}
        </div>
        <div className="text-xs text-muted-foreground">
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
                  className="h-8 w-8 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onEdit(user)}
                  className="cursor-pointer"
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
