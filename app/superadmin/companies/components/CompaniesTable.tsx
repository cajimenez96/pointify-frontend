import { Card } from "@/components/ui/card";
import { CompanyRow } from "./CompanyRow";
import type {
  Company,
  PaginationMeta,
} from "@/repositories/superadmin/companies/types";

interface CompaniesTableProps {
  companies: Company[];
  pagination?: PaginationMeta;
  isLoading: boolean;
  onEdit: (company: Company) => void;
}

export function CompaniesTable({
  companies,
  pagination,
  isLoading,
  onEdit,
}: CompaniesTableProps) {
  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
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
              <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                Código
              </th>
              <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                Razón Social
              </th>
              <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                CUIT/CUIL
              </th>
              <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                Email
              </th>
              <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                Estado
              </th>
              <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                Creada
              </th>
              <th className="text-left p-4 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-muted-foreground">
                  No hay empresas creadas
                </td>
              </tr>
            ) : (
              companies.map((company) => (
                <CompanyRow
                  key={company._id}
                  company={company}
                  onEdit={() => onEdit(company)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación info */}
      {pagination && pagination.total > 0 && (
        <div className="border-t p-4">
          <p className="text-sm text-muted-foreground text-center">
            Mostrando {companies.length} de {pagination.total} empresas
          </p>
        </div>
      )}
    </Card>
  );
}
