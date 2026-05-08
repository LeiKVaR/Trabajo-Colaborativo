"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ActivityChart({ attendance = [] }: { attendance?: any[] }) {
  const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const chartData = last7Days.map(date => {
    const count = attendance.filter(a => 
      new Date(a.date).toDateString() === date.toDateString()
    ).length;
    
    // Asumimos un máximo de 10 para la escala visual si hay pocos datos, 
    // o calculamos el porcentaje si tuviéramos el total de empleados por día.
    const percentage = Math.min((count / 5) * 100, 100); 

    return {
      day: days[date.getDay()],
      value: percentage,
      count
    };
  });

  return (
    <Card className="border-border/50 shadow-soft h-full">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="text-lg">Asistencia de la Semana</CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div 
                className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-lg transition-all duration-500 relative"
                style={{ height: `${item.value || 5}%` }}
              >
                {item.count > 0 && (
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.count} marcajes
                  </div>
                )}
              </div>
              <span className="text-xs text-muted-foreground font-medium">{item.day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
