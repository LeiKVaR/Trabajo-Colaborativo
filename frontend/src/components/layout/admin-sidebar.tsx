"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShieldCheck, 
  Users, 
  Clock,
  KanbanSquare, 
  UserCircle, 
  LogOut, 
  Sparkles,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/use-logout";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const adminLinks = [
  { name: "Dashboard Admin", href: ROUTES.ADMIN, icon: ShieldCheck },
  { name: "Gestión de Usuarios", href: ROUTES.ADMIN_USUARIOS, icon: Users },
  { name: "Asistencia Global", href: ROUTES.ADMIN_ASISTENCIA, icon: Clock },
  { name: "Todas las Tareas", href: ROUTES.ADMIN_TAREAS, icon: KanbanSquare },
  { name: "Mi Perfil Admin", href: ROUTES.ADMIN_PERFIL, icon: UserCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { handleLogout } = useLogout();
  const { user } = useAuthStore();

  return (
    <aside className="w-64 border-r border-danger/20 bg-sidebar flex-col h-screen hidden md:flex sticky top-0  overflow-hidden">
      {/* Detalle visual sutil para diferenciar el admin */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-danger via-warning to-primary" />

      {/* Logo Header */}
      <div className="p-6 flex items-center gap-3 border-b border-border/40">
        <div className="h-8 w-8 rounded-lg bg-danger/10 border border-danger/30 flex items-center justify-center shadow-soft">
          <Sparkles className="h-4 w-4 text-danger" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-tight">Asistly</span>
          <span className="text-[10px] font-bold text-danger uppercase tracking-wider">Admin Space</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {adminLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-danger/10 text-danger" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-danger")} />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-border/40 space-y-2">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <Settings className="h-4 w-4 mr-2" />
          Configuración Global
        </Button>
        <div className="flex items-center gap-3 px-3 py-3 bg-muted/50 rounded-lg border border-border/50">
          <div className="h-8 w-8 rounded-full bg-danger/20 flex items-center justify-center text-danger font-bold text-xs uppercase shadow-inner">
            {user?.firstName?.[0] || "A"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.firstName}</p>
            <p className="text-xs text-danger font-medium truncate">Administrador</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-danger hover:bg-danger/10 border-border/60" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
