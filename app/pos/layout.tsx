"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { AppSidebar } from "@/components/shared/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import { CompanyQR } from "@/components/shared/CompanyQR";

const pageNames: Record<string, string> = {
  earn: "Sumar Puntos",
  redeem: "Canjear Premio",
};

export default function POSLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, initializeAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/pos";

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (
      !isLoginPage &&
      !isLoading &&
      (!user || (user.role !== "admin" && user.role !== "cashier"))
    ) {
      router.push("/pos");
    }
  }, [user, isLoading, router, isLoginPage]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user || (user.role !== "admin" && user.role !== "cashier")) {
    return null;
  }

  const currentPage = pathname.split("/").pop() || "";
  const pageName =
    pageNames[currentPage] ||
    currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b px-4">
          <div className="flex items-center gap-2 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/pos/earn">Pointify POS</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" title="Ver QR Cliente">
                <QrCode className="h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <CompanyQR
                companyCode={user.companyCode || ""}
                companyName={user.companyName || "Tu Empresa"}
              />
            </DialogContent>
          </Dialog>
        </header>
        <div className="flex-1 p-5 bg-gray-100">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
