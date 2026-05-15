"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Protección de ruta Front-end (Mocking)
  useEffect(() => {
    setIsMounted(true);
    if (isMounted) {
      if (!accessToken) {
        router.push("/login"); // Si no hay sesión, pa' fuera
      } else if (user?.role === "ADMIN") {
        router.push("/admin"); // Si es Admin, lo mandamos a su panel correspondiente
      }
    }
  }, [accessToken, user, router, isMounted]);

  // Evita el parpadeo visual antes de verificar la sesión
  if (!isMounted || !accessToken || user?.role === "ADMIN") {
    return null; 
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <AppHeader />
        <div className="flex-1 overflow-y-auto p-6 md:p-8 stagger">
          {children}
        </div>
        <ChatWidget />
      </main>
    </div>
  );
}
