"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Clock, 
  KanbanSquare, 
  CalendarDays, 
  UserCircle, 
  LogOut, 
  Sparkles 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/use-logout";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Asistencia", href: ROUTES.ASISTENCIA, icon: Clock },
  { name: "Mis Tareas", href: ROUTES.TAREAS, icon: KanbanSquare },
  { name: "Horarios", href: ROUTES.HORARIOS, icon: CalendarDays },
  { name: "Mi Perfil", href: ROUTES.PERFIL, icon: UserCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const { handleLogout } = useLogout();

  return (
    <aside className="w-64 border-r border-border/40 bg-sidebar flex-col h-screen hidden md:flex sticky top-0">
      {/* Logo Header */}
      <div className="p-6 flex items-center gap-3 border-b border-border/40">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-soft">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-xl font-bold tracking-tight">Asistly</span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive && "text-primary")} />
              {link.name}
            </Link>
          );
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 bg-muted/50 rounded-lg border border-border/50">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs uppercase shadow-inner">
            {user?.firstName?.[0] || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.firstName} {user?.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.position || "Empleado"}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-danger hover:bg-danger/10" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </Button>
      </div>
    </aside>
  );
}
