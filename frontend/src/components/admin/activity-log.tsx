"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LogEntry {
  user: string;
  action: string;
  time: string;
  status: "success" | "primary" | "warning" | "danger";
}

export function ActivityLog({ attendance = [] }: { attendance?: any[] }) {
  // Ordenar por fecha descendente y tomar los últimos 10
  const recentAttendance = [...attendance]
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
    .slice(0, 10);

  return (
    <Card className="border-border/50 shadow-soft h-full">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="text-lg">Registro de Actividad (Log)</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {recentAttendance.length > 0 ? (
            recentAttendance.map((log, i) => (
              <div key={i} className="flex flex-col border-b border-border/40 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-success" />
                  <p className="text-sm">
                    <span className="font-semibold">{log.user?.firstName} {log.user?.lastName}</span> marcó entrada
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1 ml-5">
                   <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                     {log.location || "Presencial"}
                   </span>
                   <span className="text-xs text-muted-foreground font-mono">
                     {new Date(log.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay actividad reciente registrada.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
