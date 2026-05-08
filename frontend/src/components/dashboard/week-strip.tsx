"use client";

import { cn } from "@/lib/utils";

export function WeekStrip({ attendanceRecords = [] }: { attendanceRecords?: any[] }) {
  const DAYS = ["L", "M", "M", "J", "V", "S", "D"];
  
  // Obtener fechas de la semana actual (Lunes a Domingo)
  const curr = new Date();
  const first = curr.getDate() - curr.getDay() + (curr.getDay() === 0 ? -6 : 1); 
  
  const weekDays = DAYS.map((day, i) => {
    const d = new Date(curr.setDate(first + i));
    const worked = attendanceRecords.some(a => new Date(a.date).toDateString() === d.toDateString());
    return { day, worked };
  });

  const workedCount = weekDays.filter(d => d.worked).length;

  return (
    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/20">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Tu Semana</span>
        <div className="flex gap-2">
          {weekDays.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div 
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-bold border transition-all",
                  item.worked 
                    ? "bg-success/10 border-success/30 text-success shadow-sm" 
                    : "bg-background border-border text-muted-foreground"
                )}
              >
                {item.day}
              </div>
              {item.worked && <div className="h-1 w-1 rounded-full bg-success" />}
            </div>
          ))}
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold">{workedCount}/5</p>
        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Días laborados</p>
      </div>
    </div>
  );
}
