import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TopCompany } from "@/repositories/superadmin/dashboard/types";

interface TopCompaniesSectionProps {
  topByClients: TopCompany[];
  topByTransactions: TopCompany[];
}

export function TopCompaniesSection({
  topByClients,
  topByTransactions,
}: TopCompaniesSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top by Clients */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-2xl">👥</span>
          Top 5 Empresas por Clientes
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">
                  Clientes
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topByClients.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              ) : (
                topByClients.map((company, index) => (
                  <TableRow key={company._id}>
                    <TableCell className="text-muted-foreground font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">
                          #{index + 1}
                        </span>
                        {company.companyCode}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {company.businessName}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      {company.clientCount?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Top by Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <span className="text-2xl">💳</span>
          Top 5 Empresas por Transacciones
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">
                  Transacciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topByTransactions.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              ) : (
                topByTransactions.map((company, index) => (
                  <TableRow key={company._id}>
                    <TableCell className="text-muted-foreground font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-bold">
                          #{index + 1}
                        </span>
                        {company.companyCode}
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">
                      {company.businessName}
                    </TableCell>
                    <TableCell className="text-right text-primary font-semibold">
                      {company.transactionCount?.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
