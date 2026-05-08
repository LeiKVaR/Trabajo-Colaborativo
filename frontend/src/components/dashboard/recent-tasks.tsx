"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KanbanSquare, ArrowRight, Loader2 } from "lucide-react";
import { TASK_STATUS_META, PRIORITY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import Link from "next/link";
import { Task, TaskStatus, Priority } from "@/types/task.types";

export function RecentTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data.data.tasks.slice(0, 3)); // Solo las 3 más recientes
      } catch (error) {
        console.error("Error fetching tasks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <Card className="border-border/50 shadow-soft h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
        <CardTitle className="text-lg flex items-center gap-2">
          <KanbanSquare className="h-5 w-5 text-primary" />
          Tareas Recientes
        </CardTitle>
        <Link href="/tareas">
          <Button variant="ghost" size="sm" className="h-8 text-xs gap-1">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-1 p-0">
        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-muted-foreground">
            <p className="text-sm">No tienes tareas asignadas</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {tasks.map((task) => {
              const statusKey = task.status as keyof typeof TASK_STATUS_META;
              const priorityKey = (task.priority || "low") as keyof typeof PRIORITY_META;
              
              const statusMeta = TASK_STATUS_META[statusKey] || TASK_STATUS_META.ASSIGNED;
              const priorityMeta = PRIORITY_META[priorityKey];
              
              return (
                <div key={task.id} className="p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h4 className="font-semibold text-sm leading-tight">{task.title}</h4>
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded border uppercase",
                      priorityMeta.bg, priorityMeta.text, priorityMeta.border
                    )}>
                      {priorityMeta.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-1.5 w-1.5 rounded-full", statusMeta.dot)} />
                      <span className="text-xs text-muted-foreground">{statusMeta.label}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {new Date(task.endDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
