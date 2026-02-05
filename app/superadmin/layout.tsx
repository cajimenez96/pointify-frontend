"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, initializeAuth, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  // Rutas públicas que no requieren autenticación
  const isPublicRoute = pathname === "/superadmin/login";

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isPublicRoute && !isLoading && (!user || !user.isSuperAdmin)) {
      router.push("/superadmin/login");
    }
  }, [user, isLoading, router, isPublicRoute]);

  // Si es ruta pública, renderizar directamente sin layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Loading state solo para rutas protegidas
  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Pointify</h1>
              <p className="text-slate-400 text-xs">SuperAdmin</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavLink href="/superadmin/dashboard" icon="📊">
              Dashboard
            </NavLink>
            <NavLink href="/superadmin/companies" icon="🏢">
              Empresas
            </NavLink>
            <NavLink href="/superadmin/users" icon="👥">
              Usuarios
            </NavLink>
          </nav>

          {/* User Info */}
          <div className="mt-auto pt-8 border-t border-slate-700">
            <div className="text-slate-400 text-sm mb-4">
              <p className="font-semibold text-white">
                {user.name || user.username}
              </p>
              <p className="text-xs">Superadministrador</p>
            </div>
            <Button
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={logout}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}
