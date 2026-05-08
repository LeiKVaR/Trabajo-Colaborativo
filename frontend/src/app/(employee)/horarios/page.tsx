"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { WeekSchedule } from "@/components/horarios/week-schedule";

export default function HorariosPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);
        const response = await api.get("/schedules/my");
        const daysOrder = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
        const sorted = response.data.data.schedules.sort((a: any, b: any) => 
          daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek)
        );
        setSchedules(sorted);
      } catch (error) {
        toast.error("Error al cargar horarios");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Cargando horarios...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" />
            Mi Horario Semanal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Horarios asignados por el administrador para tu jornada actual.
          </p>
        </div>
      </div>

      {/* Componente Modular de Horarios */}
      <WeekSchedule schedules={schedules} />
    </div>
  );
}
