import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompaniesQuery } from "../../companies/hooks/useCompanies";
import type { QueryUsersDto } from "@/repositories/superadmin/users/types";

interface UserFiltersProps {
  onFilterChange: (filters: QueryUsersDto) => void;
  isLoading?: boolean;
}

export function UserFilters({ onFilterChange, isLoading }: UserFiltersProps) {
  const [username, setUsername] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: companiesData, isLoading: isLoadingCompanies } =
    useCompaniesQuery({
      page: 1,
      // limit: 100, // Get all companies for filter
    });

  const handleFilter = () => {
    const filters: QueryUsersDto = {};

    if (username.trim()) {
      filters.username = username.trim();
    }
    if (selectedCompany && selectedCompany !== "all") {
      filters.companyId = selectedCompany;
    }
    if (selectedRole && selectedRole !== "all") {
      filters.role = selectedRole as "admin" | "cashier" | "superadmin";
    }

    onFilterChange(filters);
  };

  const handleClear = () => {
    setUsername("");
    setSelectedCompany("");
    setSelectedRole("");
    onFilterChange({});
  };

  return (
    <Card className="p-6 bg-slate-800/50 border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Username Filter */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-slate-300">
            Usuario
          </Label>
          <Input
            id="username"
            placeholder="Buscar por username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            disabled={isLoading}
            className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Company Filter */}
        <div className="space-y-2">
          <Label htmlFor="company" className="text-slate-300">
            Empresa
          </Label>
          <Select
            value={selectedCompany}
            onValueChange={setSelectedCompany}
            disabled={isLoading || isLoadingCompanies}
          >
            <SelectTrigger
              id="company"
              className="bg-slate-900/50 border-slate-700 text-white"
            >
              <SelectValue placeholder="Todas las empresas" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all" className="text-white hover:bg-slate-700">
                Todas las empresas
              </SelectItem>
              {companiesData?.data.map((company) => (
                <SelectItem
                  key={company._id}
                  value={company._id}
                  className="text-white hover:bg-slate-700"
                >
                  {company.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <Label htmlFor="role" className="text-slate-300">
            Rol
          </Label>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
            disabled={isLoading}
          >
            <SelectTrigger
              id="role"
              className="bg-slate-900/50 border-slate-700 text-white"
            >
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="all" className="text-white hover:bg-slate-700">
                Todos los roles
              </SelectItem>
              <SelectItem
                value="admin"
                className="text-white hover:bg-slate-700"
              >
                Admin
              </SelectItem>
              <SelectItem
                value="cashier"
                className="text-white hover:bg-slate-700"
              >
                Cashier
              </SelectItem>
              <SelectItem
                value="superadmin"
                className="text-white hover:bg-slate-700"
              >
                SuperAdmin
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <Button
            onClick={handleFilter}
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Filtrar
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            disabled={isLoading}
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            Limpiar
          </Button>
        </div>
      </div>
    </Card>
  );
}
