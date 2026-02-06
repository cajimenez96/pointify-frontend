/**
 * Public Check Page (Landing)
 * Entry point for clients to check their points
 * URL: /check?companyCode=ABC
 */

"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Store } from "lucide-react";

function CheckContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCompanyCode = searchParams.get("companyCode") || "";

  const [dni, setDni] = useState("");
  const [companyCode, setCompanyCode] = useState(initialCompanyCode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialCompanyCode) {
      setCompanyCode(initialCompanyCode);
    }
  }, [initialCompanyCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dni || !companyCode) return;

    setIsSubmitting(true);
    // Redirect to the dynamic route
    router.push(`/check/${dni}?companyCode=${companyCode}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md p-8 space-y-8 shadow-2xl border-slate-700 bg-slate-900/90">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full mx-auto flex items-center justify-center">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Consultar Puntos</h1>
          <p className="text-slate-400">
            Ingresa tu DNI para ver tus puntos y premios
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Company Code (Only if not in URL) */}
            {!initialCompanyCode && (
              <div className="space-y-2">
                <Label htmlFor="companyCode" className="text-slate-300">
                  Código de Empresa
                </Label>
                <Input
                  id="companyCode"
                  value={companyCode}
                  onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                  placeholder="Ej: ABC123"
                  className="bg-slate-800 border-slate-600 text-white"
                  required
                />
              </div>
            )}

            {/* DNI Input */}
            <div className="space-y-2">
              <Label htmlFor="dni" className="text-slate-300">
                Tu DNI
              </Label>
              <Input
                id="dni"
                value={dni}
                onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
                placeholder="Ingresa tu número de documento"
                maxLength={8}
                className="bg-slate-800 border-slate-600 text-white text-lg h-12"
                required
                autoFocus
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={!dni || !companyCode || isSubmitting}
            className="w-full h-12 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg"
          >
            {isSubmitting ? "Buscando..." : "Ver mis Puntos"}
            {!isSubmitting && <Search className="ml-2 h-5 w-5" />}
          </Button>
        </form>

        {/* Info */}
        <div className="text-center text-sm text-slate-500">
          <p>¿Tuviste algún problema?</p>
          <p>Acércate a la caja para recibir ayuda.</p>
        </div>
      </Card>
    </div>
  );
}

export default function CheckPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CheckContent />
    </Suspense>
  );
}
