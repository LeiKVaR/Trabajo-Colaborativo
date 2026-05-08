"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MapPin, Coffee, Briefcase, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const DAY_NAMES: Record<string, string> = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

interface WeekScheduleProps {
  schedules: any[];
}

export function WeekSchedule({ schedules }: WeekScheduleProps) {
  if (schedules.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-border/60 rounded-2xl bg-muted/20">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <CalendarDays className="h-8 w-8 text-primary/60" />
        </div>
        <h3 className="text-xl font-bold text-foreground">Sin horario asignado</h3>
        <p className="text-muted-foreground text-center max-w-xs mt-2 text-sm leading-relaxed">
          Tu administrador aún no ha configurado tu jornada laboral semanal. 
          Contacta con recursos humanos si crees que esto es un error.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger">
      {schedules.map((shift, i) => {
        const isOff = !shift.isWorkDay;
        const dayName = DAY_NAMES[shift.dayOfWeek] || shift.dayOfWeek;
        
        return (
          <Card 
            key={i} 
            className={cn(
              "border-border/50 transition-all duration-200 hover-lift bg-card/50 shadow-soft",
              isOff && "opacity-60 bg-muted/30"
            )}
          >
            <CardHeader className="pb-2 border-b border-border/30">
              <CardTitle className="text-base">{dayName}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {isOff ? (
                <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                  <Coffee className="h-8 w-8 mb-2 opacity-50" />
                  <span className="text-sm font-medium">Día libre</span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground mb-1">Horario</span>
                    <div className="flex items-center gap-1.5 font-mono font-semibold">
                      <Clock className="h-4 w-4 text-primary" />
                      {shift.startTime} - {shift.endTime}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs">Oficina Principal</span>
                  </div>

                  <div className="pt-2 border-t border-border/30">
                    <div className="text-[10px] font-bold px-2 py-1 flex items-center justify-center gap-1.5 rounded-md border bg-primary/10 text-primary border-primary/20 uppercase tracking-wider">
                      <Briefcase className="h-3.5 w-3.5" />
                      Turno Presencial
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
