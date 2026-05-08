"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthName = currentDate.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Datos simulados de asistencia para el calendario
  const attendanceData: Record<number, string> = {
    1: "present", 2: "present", 3: "late", 4: "present", 5: "present",
    8: "present", 9: "absent", 10: "present", 11: "present", 12: "present",
  };

  return (
    <Card className="border-border/50 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
        <CardTitle className="text-lg flex items-center gap-2 capitalize">
          <CalendarIcon className="h-5 w-5 text-primary" />
          {monthName}
        </CardTitle>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"].map((d) => (
            <div key={d} className="text-center text-[10px] font-bold uppercase text-muted-foreground py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((b) => (
            <div key={`b-${b}`} className="h-10" />
          ))}
          {days.map((day) => {
            const status = attendanceData[day];
            return (
              <div 
                key={day} 
                className={cn(
                  "h-10 flex items-center justify-center rounded-lg text-xs font-medium border border-transparent transition-all cursor-default relative group",
                  status === "present" && "bg-success/10 text-success border-success/20",
                  status === "late" && "bg-warning/10 text-warning border-warning/20",
                  status === "absent" && "bg-danger/10 text-danger border-danger/20",
                  !status && "hover:bg-muted"
                )}
              >
                {day}
                {status && (
                  <div className={cn(
                    "absolute bottom-1 h-1 w-1 rounded-full",
                    status === "present" && "bg-success",
                    status === "late" && "bg-warning",
                    status === "absent" && "bg-danger"
                  )} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4 justify-center pt-4 border-t border-border/40">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-success" /> Presente
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-warning" /> Tarde
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-danger" /> Falta
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
