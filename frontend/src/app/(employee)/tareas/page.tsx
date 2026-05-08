"use client";

import { useEffect, useState } from "react";
import { KanbanSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/types/task.types";
import api from "@/lib/axios";
import { toast } from "sonner";
import { KanbanBoard } from "@/components/tareas/kanban-board";

export default function TareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      const mappedTasks = response.data.data.tasks.map((t: any) => ({
        ...t,
        assignees: t.assignments?.map((a: any) => a.user) || []
      }));
      setTasks(mappedTasks);
    } catch (error) {
      console.error("Error fetching tasks", error);
      toast.error("Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      // Actualización optimista
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success("Estado actualizado");
    } catch (error) {
      toast.error("Error al mover la tarea");
      fetchTasks(); // Revertir en caso de error
    }
  };

  const advanceTask = async (taskId: string, currentStatus: TaskStatus) => {
    const nextStatus: Record<TaskStatus, TaskStatus> = {
      ASSIGNED: "IN_PROGRESS",
      IN_PROGRESS: "COMPLETED",
      COMPLETED: "COMPLETED"
    };

    if (currentStatus === "COMPLETED") return;
    handleStatusChange(taskId, nextStatus[currentStatus]);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">Cargando tablero...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 max-w-7xl mx-auto">
      {/* Header del Kanban */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <KanbanSquare className="h-6 w-6 text-primary" />
            Mis Tareas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Supervisa y gestiona tu progreso diario.</p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-lg border border-border/40">
          <Button variant="ghost" size="sm" className="h-8 text-xs font-medium bg-background shadow-sm">Kanban</Button>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-medium">Lista</Button>
        </div>
      </div>

      {/* Tablero Kanban */}
      <KanbanBoard 
        tasks={tasks} 
        onAdvance={advanceTask} 
        onStatusChange={handleStatusChange} 
      />
    </div>
  );
}
