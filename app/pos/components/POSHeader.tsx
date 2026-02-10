"use client";

import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Store, QrCode } from "lucide-react";
import { CompanyQR } from "@/components/shared/CompanyQR";
import type { User } from "@/lib/auth-store";

interface POSHeaderProps {
  user: User;
  onLogout: () => void;
}

export function POSHeader({ user, onLogout }: POSHeaderProps) {
  const handleLogout = () => {
    onLogout();
    toast.info("Sesión cerrada");
  };

  return (
    <header className="mb-8">
      <Card className="p-4 border-slate-700 bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Punto de Venta</h1>
              <p className="text-slate-400 text-sm">
                Usuario:{" "}
                <span className="text-white">{user.username}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-800"
                  title="Ver QR Cliente"
                >
                  <QrCode className="h-6 w-6" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white text-slate-900 border-none">
                <CompanyQR
                  companyCode={user.companyCode || ""}
                  companyName={user.companyName || "Tu Empresa"}
                />
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              onClick={handleLogout}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </Card>
    </header>
  );
}
