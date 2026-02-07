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
      <Card className="bg-slate-800 border-slate-700 p-8">
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900 border-b border-slate-700">
            <tr>
              <th className="text-left p-4 text-slate-300 font-semibold">
                Código
              </th>
              <th className="text-left p-4 text-slate-300 font-semibold">
                Razón Social
              </th>
              <th className="text-left p-4 text-slate-300 font-semibold">
                CUIT/CUIL
              </th>
              <th className="text-left p-4 text-slate-300 font-semibold">
                Email
              </th>
              <th className="text-left p-4 text-slate-300 font-semibold">
                Estado
              </th>
              <th className="text-left p-4 text-slate-300 font-semibold">
                Creada
              </th>
              <th className="text-left p-4 text-slate-300 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-slate-400">
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
        <div className="border-t border-slate-700 p-4">
          <p className="text-sm text-slate-400 text-center">
            Mostrando {companies.length} de {pagination.total} empresas
          </p>
        </div>
      )}
    </Card>
  );
}
