"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, Clock, UserCheck, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardsProps {
  metrics: {
    totalUsers: number;
    todayAttendance: number;
    pendingUsers: number;
    activeTasks: number;
  };
}

export function KPICards({ metrics }: KPICardsProps) {
  const cards = [
    {
      title: "Total Empleados",
      value: metrics.totalUsers,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Personal registrado"
    },
    {
      title: "Asistencias Hoy",
      value: metrics.todayAttendance,
      icon: UserCheck,
      color: "text-success",
      bg: "bg-success/10",
      description: "Marcajes registrados"
    },
    {
      title: "Pendientes",
      value: metrics.pendingUsers,
      icon: Clock,
      color: "text-warning",
      bg: "bg-warning/10",
      description: "Por aprobar cuenta"
    },
    {
      title: "Tareas Activas",
      value: metrics.activeTasks,
      icon: AlertCircle,
      color: "text-danger",
      bg: "bg-danger/10",
      description: "En progreso/Asignadas"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <Card key={i} className="border-border/50 shadow-soft hover-lift bg-card/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <h3 className="text-2xl font-bold mt-1 tracking-tight">{card.value}</h3>
              </div>
              <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center shadow-inner", card.bg)}>
                <card.icon className={cn("h-6 w-6", card.color)} />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-4 flex items-center gap-1">
              <span className="inline-block w-1 h-1 rounded-full bg-border" />
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
