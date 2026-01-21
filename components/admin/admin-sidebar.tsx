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
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Pointify</h1>
        <p className="text-sm text-gray-400 mt-1">Panel Admin</p>
      </div>

      <Separator className="bg-gray-700" />

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <Icon size={20} weight="bold" aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <Separator className="bg-gray-700" />

      <div className="p-4">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-400">Sesión activa</p>
          <p className="font-semibold">{user?.name || user?.dni}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>

        <Button
          variant="outline"
          className="w-full border-gray-700 hover:bg-gray-800"
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
