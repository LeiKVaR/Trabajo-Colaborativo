"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AppHeader } from "@/components/layout/app-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // El Gran Guardián: Verifica sesión y ROL
  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      if (!accessToken) {
        router.push("/login"); // Si no está logueado
      } else if (user?.role !== "ADMIN") {
        router.push("/dashboard"); // Si es un infiltrado (empleado normal)
      }
    }
  }, [accessToken, user, router, isMounted]);

  // Si no ha montado, o no es admin, no renderizamos el layout secreto
  if (!isMounted || !accessToken || user?.role !== "ADMIN") {
    return null; 
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 stagger">
          {children}
        </div>
      </main>
    </div>
  );
}
