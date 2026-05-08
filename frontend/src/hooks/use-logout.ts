"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success("Sesión cerrada correctamente");
    // Usamos window.location.href para asegurar que se limpie todo el estado de la app
    window.location.href = "/login";
  };

  return { handleLogout };
}
