"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Timer, CheckCircle2, AlertCircle } from "lucide-react";

interface DaySummaryProps {
  metrics: {
    hoursWorked: string;
    tasksCompleted: number;
    tasksPending: number;
  };
}

export function DaySummary({ metrics }: DaySummaryProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card className="border-border/50 shadow-soft bg-card/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Timer className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Horas Hoy</p>
            <p className="text-xl font-bold font-mono">{metrics.hoursWorked}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-soft bg-card/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-success" />
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Completadas</p>
            <p className="text-xl font-bold">{metrics.tasksCompleted}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-soft bg-card/50 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-warning" />
        <CardContent className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pendientes</p>
            <p className="text-xl font-bold">{metrics.tasksPending}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
