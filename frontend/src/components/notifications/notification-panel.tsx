"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  time: string;
  read: boolean;
}

export function NotificationPanel() {
  const notifications: Notification[] = [
    {
      id: "1",
      title: "Nueva Tarea Asignada",
      message: "Se te ha asignado la tarea 'Revisión de Inventario'.",
      type: "info",
      time: "Hace 2 min",
      read: false
    },
    {
      id: "2",
      title: "Asistencia Registrada",
      message: "Tu marcaje de entrada fue exitoso.",
      type: "success",
      time: "Hace 1 hora",
      read: true
    },
    {
      id: "3",
      title: "Recordatorio de Turno",
      message: "Tu turno de mañana comienza a las 08:00 AM.",
      type: "warning",
      time: "Hace 3 horas",
      read: true
    }
  ];

  return (
    <Card className="border-border/50 shadow-soft w-[350px]">
      <CardHeader className="pb-4 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notificaciones
        </CardTitle>
        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
          {notifications.filter(n => !n.read).length} Nuevas
        </span>
      </CardHeader>
      <CardContent className="p-0 max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs italic">
            No tienes notificaciones nuevas.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {notifications.map((n) => (
              <div key={n.id} className={cn(
                "p-4 hover:bg-muted/30 transition-colors cursor-pointer relative",
                !n.read && "bg-primary/5"
              )}>
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <div className="flex gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    n.type === "info" && "bg-blue-500/10 text-blue-500",
                    n.type === "success" && "bg-green-500/10 text-green-500",
                    n.type === "warning" && "bg-amber-500/10 text-amber-500"
                  )}>
                    {n.type === "info" && <Info className="h-4 w-4" />}
                    {n.type === "success" && <Check className="h-4 w-4" />}
                    {n.type === "warning" && <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-bold leading-none">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{n.message}</p>
                    <p className="text-[9px] text-muted-foreground font-mono pt-1">{n.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
