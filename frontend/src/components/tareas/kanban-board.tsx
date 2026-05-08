"use client";

import { Task, TaskStatus } from "@/types/task.types";
import { TASK_STATUS_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { TaskCard } from "./task-card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { 
  DndContext, 
  DragEndEvent, 
  PointerSensor, 
  useSensor, 
  useSensors,
  closestCorners,
  DragOverEvent
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy,
  arrayMove 
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";

interface KanbanBoardProps {
  tasks: Task[];
  onStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
  onAdvance?: (taskId: string, currentStatus: TaskStatus) => void;
}

export function KanbanBoard({ tasks, onStatusChange, onAdvance }: KanbanBoardProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Permite clicks sin disparar el drag inmediatamente
      },
    })
  );

  const statuses: { key: TaskStatus; title: string }[] = [
    { key: "ASSIGNED", title: "Por hacer" },
    { key: "IN_PROGRESS", title: "En progreso" },
    { key: "COMPLETED", title: "Completadas" },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;

    // Si el 'overId' es una de las llaves de status, significa que soltamos en la columna
    if (statuses.some(s => s.key === overId)) {
      const task = tasks.find(t => t.id === taskId);
      if (task && task.status !== overId) {
        onStatusChange?.(taskId, overId as TaskStatus);
      }
    } else {
      // Si soltamos sobre otra tarea, buscamos el status de esa tarea
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== overTask.status) {
          onStatusChange?.(taskId, overTask.status);
        }
      }
    }
  };

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {statuses.map((status) => (
          <KanbanColumn 
            key={status.key} 
            status={status.key} 
            title={status.title} 
            tasks={tasks.filter(t => t.status === status.key)}
            onAdvance={onAdvance}
          />
        ))}
      </div>
    </DndContext>
  );
}

function KanbanColumn({ status, title, tasks, onAdvance }: { status: TaskStatus, title: string, tasks: Task[], onAdvance?: any }) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  const meta = TASK_STATUS_META[status];

  return (
    <div className="flex flex-col gap-4 min-w-[300px] max-w-[350px] flex-1">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className={cn("h-2 w-2 rounded-full", meta.dot)} />
          <h3 className="font-bold text-sm text-foreground/80">{title}</h3>
          <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-3 bg-muted/30 p-3 rounded-xl border border-border/20 overflow-y-auto min-h-[500px]"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onAdvance={onAdvance} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center border border-dashed border-border/40 rounded-xl text-muted-foreground text-xs italic opacity-50">
            No hay tareas
          </div>
        )}
      </div>
    </div>
  );
}
