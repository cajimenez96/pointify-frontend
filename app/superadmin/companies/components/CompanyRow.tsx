import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import type { Company } from "@/repositories/superadmin/companies/types";

interface CompanyRowProps {
  company: Company;
  onEdit: () => void;
}

export function CompanyRow({ company, onEdit }: CompanyRowProps) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="p-4 text-foreground font-mono">{company.companyCode}</td>
      <td className="p-4 text-foreground">{company.businessName}</td>
      <td className="p-4 text-foreground">{company.cuitCuil}</td>
      <td className="p-4 text-foreground">{company.contactInfo.email}</td>
      <td className="p-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm ${
            company.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {company.isActive ? "Activa" : "Inactiva"}
        </span>
      </td>
      <td className="p-4 text-muted-foreground text-sm">
        {new Date(company.createdAt).toLocaleDateString("es-AR")}
      </td>
      <td className="p-4">
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
              onClick={onEdit}
              className="cursor-pointer"
            >
              Actualizar datos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
