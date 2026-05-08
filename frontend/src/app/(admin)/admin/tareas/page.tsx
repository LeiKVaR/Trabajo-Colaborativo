"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, MoreHorizontal, Calendar, Filter, Loader2 } from "lucide-react";
import { TASK_STATUS_META, PRIORITY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { CreateTaskModal } from "@/components/admin/create-task-modal";
import { Task } from "@/types/task.types";

export default function AdminTareasPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto flex flex-col h-full">
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchTasks} 
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Monitor de Tareas Global</h1>
          <p className="text-sm text-muted-foreground mt-1">Supervisa el progreso de todos los departamentos.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hover-lift gap-2 shadow-sm">
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          <Button 
            className="hover-lift gap-2 shadow-card"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" /> Asignar Tarea
          </Button>
        </div>
      </div>

      <Card className="border-border/50 shadow-soft bg-card/50 flex-1">
        <CardHeader className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">Todas las asignaciones</CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre de tarea..." 
              className="pl-9 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border/40">
                <tr>
                  <th className="px-6 py-4 font-medium">Nombre de la Tarea</th>
                  <th className="px-6 py-4 font-medium">Asignado a</th>
                  <th className="px-6 py-4 font-medium">Prioridad</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium">Fecha Límite</th>
                  <th className="px-6 py-4 font-medium text-right">Opciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 stagger">
                {filteredTasks.map((task) => {
                  const statusKey = task.status as keyof typeof TASK_STATUS_META;
                  const priorityKey = (task.priority?.toLowerCase() || "low") as keyof typeof PRIORITY_META;
                  
                  const statusMeta = TASK_STATUS_META[statusKey];
                  const priorityMeta = PRIORITY_META[priorityKey];

                  return (
                    <tr key={task.id} className="hover:bg-muted/20 transition-colors">
                      {/* Título */}
                      <td className="px-6 py-4 font-medium">
                        {task.title}
                      </td>

                      {/* Asignados */}
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {task.assignees.map((a, i) => (
                            <div key={i} title={`${a.firstName} ${a.lastName}`} className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground border-2 border-background shadow-sm">
                              {a.firstName[0]}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Prioridad */}
                      <td className="px-6 py-4">
                        <span className={cn("text-[10px] uppercase font-bold px-2 py-1 rounded-sm border", priorityMeta.bg, priorityMeta.text, priorityMeta.border)}>
                          {priorityMeta.label}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("h-2 w-2 rounded-full", statusMeta.dot)} />
                          <span className={cn("font-medium", statusMeta.text)}>
                            {statusMeta.label}
                          </span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(task.endDate).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

