/**
 * CompanyQR Component
 * Displays a QR code for the company's public check page
 */

"use client";

import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Copy, ExternalLink, QrCode } from "lucide-react";
import { toast } from "sonner";

interface CompanyQRProps {
  companyCode: string;
  companyName?: string;
}

export function CompanyQR({ companyCode, companyName }: CompanyQRProps) {
  // Construct URL: origin + /check?companyCode=CODE
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const qrUrl = `${origin}/check?companyCode=${companyCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrUrl);
    toast.success("Enlace copiado al portapapeles");
  };

  const handleOpenLink = () => {
    window.open(qrUrl, "_blank");
  };

  return (
    <Card className="p-6 bg-white border-slate-200 shadow-lg max-w-sm mx-auto">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          {companyName || "Escanea para ver tus puntos"}
        </h3>
        <p className="text-sm text-slate-500">Vista Pública para Clientes</p>
      </div>

      <div className="bg-white p-4 rounded-xl border-2 border-slate-100 mb-6 flex justify-center">
        <div
          style={{
            height: "auto",
            margin: "0 auto",
            maxWidth: 200,
            width: "100%",
          }}
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={qrUrl}
            viewBox={`0 0 256 256`}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-200">
          <p className="text-xs text-slate-400 mb-1">Enlace directo:</p>
          <code className="text-xs font-mono text-slate-700 bg-slate-100 px-2 py-1 rounded block overflow-hidden text-ellipsis whitespace-nowrap">
            {qrUrl}
          </code>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full text-slate-600 border-slate-300 hover:bg-slate-50"
            onClick={handleCopyLink}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar
          </Button>
          <Button
            variant="outline"
            className="w-full text-slate-600 border-slate-300 hover:bg-slate-50"
            onClick={handleOpenLink}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir
          </Button>
        </div>
      </div>
    </Card>
  );
}
