import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";

interface ClientsFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterChange: (value: string) => void;
}

export function ClientsFilters({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
}: ClientsFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, DNI o email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>

      <Tabs
        value={filterStatus}
        onValueChange={onFilterChange}
        className="w-full md:w-auto"
      >
        <TabsList>
          <TabsTrigger value="ALL">Todos</TabsTrigger>
          <TabsTrigger value="ACTIVE">Activos</TabsTrigger>
          <TabsTrigger value="PENDING">Pendientes</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
