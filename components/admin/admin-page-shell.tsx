'use client';

import type { ReactNode } from 'react';

type AdminPageShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const AdminPageShell = ({ title, description, children }: AdminPageShellProps) => {
  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {description ? <p className="text-gray-600">{description}</p> : null}
      </header>
      {children}
    </div>
  );
};

