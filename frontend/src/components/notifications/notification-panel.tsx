"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Check, Info, AlertTriangle, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";

export function NotificationPanel() {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    deleteNotification, 
    markAllAsRead,
    unreadCount 
  } = useNotifications();

  if (isLoading) {
    return (
      <Card className="border-border/50 shadow-soft w-[350px]">
        <div className="p-8 text-center text-xs text-muted-foreground">
          Cargando notificaciones...
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-soft w-[350px] overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/40 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          Notificaciones
        </CardTitle>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] h-6 px-2 text-primary hover:bg-primary/5"
              onClick={() => markAllAsRead()}
            >
              Marcar todo como leído
            </Button>
          )}
          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
            {unreadCount} Nuevas
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-xs italic">
            No tienes notificaciones en este momento.
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={cn(
                  "p-4 hover:bg-muted/30 transition-colors group relative",
                  !n.isRead && "bg-primary/5"
                )}
                onClick={() => !n.isRead && markAsRead(n.id)}
              >
                {!n.isRead && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                
                {/* Botón de eliminar (X) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="absolute right-2 top-2 p-1 rounded-full bg-muted/50 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-danger/10 hover:text-danger transition-all"
                >
                  <X className="h-3 w-3" />
                </button>

                <div className="flex gap-3">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    n.type === "task_assigned" && "bg-blue-500/10 text-blue-500",
                    n.type === "status_changed" && "bg-amber-500/10 text-amber-500",
                    n.type === "success" && "bg-green-500/10 text-green-500",
                    (!n.type || n.type === "info") && "bg-muted text-muted-foreground"
                  )}>
                    {n.type === "task_assigned" && <Bell className="h-4 w-4" />}
                    {n.type === "status_changed" && <AlertTriangle className="h-4 w-4" />}
                    {n.type === "success" && <Check className="h-4 w-4" />}
                    {(!n.type || n.type === "info") && <Info className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 space-y-1 pr-4">
                    <p className="text-xs font-bold leading-none">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{n.message}</p>
                    <p className="text-[9px] text-muted-foreground font-mono pt-1">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: es })}
                    </p>
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
