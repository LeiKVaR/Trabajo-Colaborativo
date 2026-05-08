"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, UserPlus, FileDown } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";

import { KPICards } from "@/components/admin/kpi-cards";
import { ActivityChart } from "@/components/admin/activity-chart";
import { ActivityLog } from "@/components/admin/activity-log";
import { DepartmentOverview } from "@/components/admin/department-overview";

export default function AdminDashboardPage() {
  const { user } = useAuthStore();
  const [data, setData] = useState({
    users: [],
    attendance: [],
    tasks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersRes, attendanceRes, pendingRes, tasksRes] = await Promise.all([
          api.get("/users"),
          api.get("/attendance"),
          api.get("/users/pending"),
          api.get("/tasks")
        ]);
        
        setData({
          users: usersRes.data?.data?.users || usersRes.data?.users || [],
          attendance: attendanceRes.data?.data?.attendance || attendanceRes.data?.attendance || [],
          tasks: tasksRes.data?.data?.tasks || tasksRes.data?.tasks || []
        });
      } catch (error) {
        console.error("Error fetching admin data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const metrics = {
    totalUsers: data.users.length,
    todayAttendance: data.attendance.filter((a: any) => 
      new Date(a.date).toDateString() === new Date().toDateString()
    ).length,
    pendingUsers: data.users.filter((u: any) => u.status === "PENDING").length,
    activeTasks: data.tasks.filter((t: any) => t.status !== "COMPLETED").length
  };

  const todayStr = new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="inline-flex items-center rounded-full border border-danger/20 bg-danger/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-danger mb-3 shadow-soft">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" /> Administrador del Sistema
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Panel de Control
          </h1>
          <p className="text-muted-foreground mt-1 capitalize font-medium">
            {todayStr}
          </p>
        </div>
      </div>

      {/* Tarjetas KPI */}
      <KPICards metrics={metrics} />

      {/* Grid Inferior: Gráficas y Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart attendance={data.attendance} />
          <DepartmentOverview users={data.users} />
        </div>
        <div className="lg:col-span-1">
          <ActivityLog attendance={data.attendance} />
        </div>
      </div>
    </div>
  );
}
