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
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Username Filter */}
        <div className="space-y-2">
          <Label htmlFor="username">
            Usuario
          </Label>
          <Input
            id="username"
            placeholder="Buscar por username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFilter()}
            disabled={isLoading}
          />
        </div>

        {/* Company Filter */}
        <div className="space-y-2">
          <Label htmlFor="company">
            Empresa
          </Label>
          <Select
            value={selectedCompany}
            onValueChange={setSelectedCompany}
            disabled={isLoading || isLoadingCompanies}
          >
            <SelectTrigger id="company">
              <SelectValue placeholder="Todas las empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                Todas las empresas
              </SelectItem>
              {companiesData?.data.map((company) => (
                <SelectItem
                  key={company._id}
                  value={company._id}
                >
                  {company.businessName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="space-y-2">
          <Label htmlFor="role">
            Rol
          </Label>
          <Select
            value={selectedRole}
            onValueChange={setSelectedRole}
            disabled={isLoading}
          >
            <SelectTrigger id="role">
              <SelectValue placeholder="Todos los roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                Todos los roles
              </SelectItem>
              <SelectItem value="admin">
                Admin
              </SelectItem>
              <SelectItem value="cashier">
                Cashier
              </SelectItem>
              <SelectItem value="superadmin">
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
            className="flex-1"
          >
            Filtrar
          </Button>
          <Button
            onClick={handleClear}
            variant="outline"
            disabled={isLoading}
          >
            Limpiar
          </Button>
        </div>
      </div>
    </Card>
  );
}
