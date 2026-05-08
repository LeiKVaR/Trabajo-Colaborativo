"use client";

import { cn } from "@/lib/utils";

interface HistoryTableProps {
  data: any[];
}

export function HistoryTable({ data }: HistoryTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/40">
          <tr>
            <th className="px-6 py-4 font-medium">Empleado</th>
            <th className="px-6 py-4 font-medium">Fecha</th>
            <th className="px-6 py-4 font-medium">Entrada</th>
            <th className="px-6 py-4 font-medium">Salida</th>
            <th className="px-6 py-4 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/40">
          {data.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                No se encontraron registros de asistencia.
              </td>
            </tr>
          ) : (
            data.map((log: any) => (
              <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                      {log.user.firstName?.[0]}{log.user.lastName?.[0]}
                    </div>
                    <span className="font-medium truncate max-w-[150px]">
                      {log.user.firstName} {log.user.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                  {new Date(log.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {log.checkIn ? new Date(log.checkIn).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="px-6 py-4 font-mono text-xs">
                  {log.checkOut ? new Date(log.checkOut).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }) : '-'}
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    log.status === "CHECKED_OUT" || log.status === "COMPLETED" 
                      ? "bg-success/20 text-success" 
                      : "bg-warning/20 text-warning"
                  )}>
                    {log.status === "CHECKED_OUT" || log.status === "COMPLETED" ? "Completado" : "En Turno"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
