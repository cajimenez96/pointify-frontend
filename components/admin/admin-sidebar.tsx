'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChartLine, GearSix, SignOut, Users } from '@phosphor-icons/react';

export function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: ChartLine,
    },
    {
      label: 'Clientes',
      href: '/admin/clients',
      icon: Users,
    },
    {
      label: 'Configuración',
      href: '/admin/settings',
      icon: GearSix,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
          Pointify
        </h1>
        <p className="text-sm text-slate-400 mt-1">Panel Admin</p>
      </div>

      <Separator className="bg-slate-700" />

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                <Icon size={20} weight="bold" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-slate-700" />

      <div className="p-4">
        <div className="bg-slate-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-slate-400">Sesión activa</p>
          <p className="font-semibold">{user?.name || user?.dni}</p>
          <p className="text-xs text-violet-400 capitalize">{user?.role}</p>
        </div>

        <Button
          variant="outline"
          className="w-full border-slate-700 hover:bg-slate-800 hover:text-violet-400"
          onClick={logout}
        >
          <span className="flex items-center justify-center gap-2">
            <SignOut size={18} weight="bold" aria-hidden="true" />
            Cerrar Sesión
          </span>
        </Button>
      </div>
    </aside>
  );
}
