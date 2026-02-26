/**
 * CompanyQRCard - Card with button to view company QR code
 */

"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { CompanyQR } from "@/components/shared/CompanyQR";

export function CompanyQRCard() {
  const { user } = useAuthStore();
  const [showQR, setShowQR] = useState(false);

  if (!user?.companyCode) return null;

  return (
    <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Vista Pública</h3>
      <Button variant="outline" onClick={() => setShowQR(true)}>
        <QrCode className="h-4 w-4 mr-2" />
        Ver QR de Acceso
      </Button>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md">
          <CompanyQR
            companyCode={user.companyCode}
            companyName={user.companyName}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
}
