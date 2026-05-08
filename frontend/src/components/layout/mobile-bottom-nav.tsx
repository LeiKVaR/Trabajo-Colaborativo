"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Clock, KanbanSquare, CalendarDays, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const navLinks = [
  { name: "Inicio", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { name: "Marcaje", href: ROUTES.ASISTENCIA, icon: Clock },
  { name: "Tareas", href: ROUTES.TAREAS, icon: KanbanSquare },
  { name: "Horario", href: ROUTES.HORARIOS, icon: CalendarDays },
  { name: "Perfil", href: ROUTES.PERFIL, icon: UserCircle },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  // No mostrar en rutas de autenticación
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t border-border/40 flex items-center justify-around px-2 z-50">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;
        
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div className={cn(
              "p-1 rounded-lg transition-all",
              isActive && "bg-primary/10"
            )}>
              <Icon className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{link.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
