"use client";

import { useAuthStore } from "@/lib/auth-store";
import { useLoginPOSMutation } from "./hooks/useLoginPOS";
import { POSLogin } from "./components/POSLogin";
import { POSHeader } from "./components/POSHeader";
import { POSDashboard } from "./components/POSDashboard";

export default function POSPage() {
  const { user, logout } = useAuthStore();
  const loginMutation = useLoginPOSMutation();

  if (!user) {
    return (
      <POSLogin
        onLogin={(data) => loginMutation.mutate(data)}
        isSubmitting={loginMutation.isPending}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4 md:p-8">
      <POSHeader user={user} onLogout={logout} />
      <POSDashboard />
    </div>
  );
}
