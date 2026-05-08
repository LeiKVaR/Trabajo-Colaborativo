"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, CalendarDays, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import Link from "next/link";

import { AttendanceCard } from "@/components/dashboard/attendance-card";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { DaySummary } from "@/components/dashboard/day-summary";
import { WeekStrip } from "@/components/dashboard/week-strip";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [metrics, setMetrics] = useState({
    status: "NOT_STARTED",
    tasksCompleted: 0,
    tasksPending: 0,
    hoursWorked: "00:00:00",
    todaySchedule: null as any,
    attendanceRecords: [] as any[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statusRes, tasksRes, scheduleRes, attendanceRes] = await Promise.all([
          api.get("/attendance/status"),
          api.get("/tasks"),
          api.get("/schedules/my"),
          api.get("/attendance/my")
        ]);

        // Calcular tareas
        const tasks = tasksRes.data?.data?.tasks || [];
        const completed = tasks.filter((t: any) => t.status === "COMPLETED").length;
        const pending = tasks.filter((t: any) => t.status !== "COMPLETED").length;

        // Calcular horario
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
        const schedules = scheduleRes.data?.data?.schedules || [];
        const todaySchedule = schedules.find((s: any) => s.dayOfWeek === today);

        // Calcular horas hoy
        const todayAttendance = attendanceRes.data?.data?.attendance?.find((a: any) => 
          new Date(a.date).toDateString() === new Date().toDateString()
        );

        let hoursStr = "00:00:00";
        if (todayAttendance?.checkIn) {
          const start = new Date(todayAttendance.checkIn).getTime();
          const end = todayAttendance.checkOut ? new Date(todayAttendance.checkOut).getTime() : Date.now();
          const diffMs = end - start;
          const h = Math.floor(diffMs / 3600000);
          const m = Math.floor((diffMs % 3600000) / 60000);
          const s = Math.floor((diffMs % 60000) / 1000);
          hoursStr = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }

        setMetrics({
          status: statusRes.data?.data?.attendance?.status || "NOT_STARTED",
          tasksCompleted: completed,
          tasksPending: pending,
          hoursWorked: hoursStr,
          todaySchedule,
          attendanceRecords: attendanceRes.data?.data?.attendance || []
        });
      } catch (error) {
        console.error("Error fetching employee data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todayStr = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Hola, {user?.firstName || "Equipo"} 👋
          </h1>
          <p className="text-muted-foreground mt-1 capitalize font-medium">
            {todayStr}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal: Asistencia */}
        <div className="lg:col-span-2 space-y-6">
          <DaySummary metrics={{ 
            hoursWorked: metrics.hoursWorked, 
            tasksCompleted: metrics.tasksCompleted, 
            tasksPending: metrics.tasksPending 
          }} />
          <AttendanceCard />
          <WeekStrip attendanceRecords={metrics.attendanceRecords} />
          
          {/* Horario de Hoy */}
          <Card className="border-border/50 shadow-soft bg-card/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Horario de Hoy</p>
                    <p className="font-bold">
                      {!metrics.todaySchedule 
                        ? 'Sin horario asignado' 
                        : metrics.todaySchedule.isWorkDay 
                          ? `${metrics.todaySchedule.startTime} - ${metrics.todaySchedule.endTime}`
                          : 'Día no laborable / Descanso'}
                    </p>
                  </div>
                </div>
                <Link href="/horarios">
                  <Button variant="outline" size="sm" className="h-8 text-xs">Ver semana</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna Lateral: Tareas */}
        <div className="lg:col-span-1">
          <RecentTasks />
        </div>
      </div>
    </div>
  );
}