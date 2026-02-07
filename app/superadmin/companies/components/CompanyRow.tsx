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
    <tr className="border-b border-slate-700 hover:bg-slate-700/50">
      <td className="p-4 text-white font-mono">{company.companyCode}</td>
      <td className="p-4 text-white">{company.businessName}</td>
      <td className="p-4 text-slate-300">{company.cuitCuil}</td>
      <td className="p-4 text-slate-300">{company.contactInfo.email}</td>
      <td className="p-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm ${
            company.isActive
              ? "bg-green-900/50 text-green-300"
              : "bg-red-900/50 text-red-300"
          }`}
        >
          {company.isActive ? "Activa" : "Inactiva"}
        </span>
      </td>
      <td className="p-4 text-slate-400 text-sm">
        {new Date(company.createdAt).toLocaleDateString("es-AR")}
      </td>
      <td className="p-4">
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
              onClick={onEdit}
              className="cursor-pointer hover:bg-slate-700"
            >
              Actualizar datos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
