import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift } from "lucide-react";
import type { Client } from "@/repositories/clients/types";
import { RedeemDialog } from "./RedeemDialog";

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
}

export function ClientsTable({ clients, isLoading }: ClientsTableProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isRedeemOpen, setIsRedeemOpen] = useState(false);

  const handleOpenRedeem = (client: Client) => {
    setSelectedClient(client);
    setIsRedeemOpen(true);
  };

  const handleCloseRedeem = () => {
    setIsRedeemOpen(false);
    setSelectedClient(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-full" />
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">
          No se encontraron clientes que coincidan con los filtros.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>DNI</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Puntos Disp.</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Fecha Registro</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id}>
                <TableCell className="font-mono font-medium">
                  {client.dni}
                </TableCell>
                <TableCell>
                  {client.name || (
                    <span className="text-muted-foreground italic">
                      Sin nombre
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {client.email || (
                    <span className="text-muted-foreground italic text-xs">
                      No registrado
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-bold text-primary">
                  {client.currentPoints} pts
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      client.status === "ACTIVE" ? "default" : "secondary"
                    }
                    className={
                      client.status === "ACTIVE"
                        ? "bg-green-100 text-green-800 hover:bg-green-200 border-transparent shadow-none"
                        : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-transparent shadow-none"
                    }
                  >
                    {client.status === "ACTIVE" ? "ACTIVO" : "PENDIENTE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {new Date(client.createdAt).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 lg:px-3 text-primary border-primary/20 hover:bg-primary/5 hover:text-primary"
                    onClick={() => handleOpenRedeem(client)}
                    disabled={client.currentPoints <= 0}
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Canjear
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <RedeemDialog
        isOpen={isRedeemOpen}
        onClose={handleCloseRedeem}
        client={selectedClient}
      />
    </>
  );
}
