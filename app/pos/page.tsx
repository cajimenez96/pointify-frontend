"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { useLoginPOSMutation } from "./hooks/useLoginPOS";
import { POSLogin } from "./components/POSLogin";

export default function POSPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const loginMutation = useLoginPOSMutation();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/pos/earn");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  return (
    <POSLogin
      onLogin={(data) => loginMutation.mutate(data)}
      isSubmitting={loginMutation.isPending}
    />
  );
}
