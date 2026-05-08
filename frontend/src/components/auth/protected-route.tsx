"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "EMPLOYEE")[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, accessToken, _hasHydrated } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si no ha hidratado (cargado de localStorage), no hacemos nada todavía
    if (!_hasHydrated) return;

    if (!accessToken) {
      router.push("/login");
      return;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push(user.role === "ADMIN" ? "/admin" : "/dashboard");
      return;
    }

    setLoading(false);
  }, [accessToken, user, router, allowedRoles, _hasHydrated]);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
