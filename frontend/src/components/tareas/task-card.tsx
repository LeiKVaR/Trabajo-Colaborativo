"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { PRIORITY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Task;
  onAdvance?: (taskId: string, currentStatus: any) => void;
}

export function TaskCard({ task, onAdvance }: TaskCardProps) {
  const priorityMeta = PRIORITY_META[task.priority || "low"];
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-24 opacity-30 border-2 border-dashed border-primary/40 rounded-xl bg-primary/5"
      />
    );
  }

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group border-border/60 shadow-sm hover:shadow-md transition-all duration-200 bg-background cursor-grab active:cursor-grabbing"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <h4 className="font-bold text-sm leading-tight group-hover:text-primary transition-colors">
            {task.title}
          </h4>
          {task.status !== "COMPLETED" && onAdvance && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 -mr-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
              onClick={(e) => {
                e.stopPropagation();
                onAdvance(task.id, task.status);
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description || "Sin descripción disponible."}
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-tighter",
              priorityMeta.bg, priorityMeta.text, priorityMeta.border
            )}>
              {priorityMeta.label}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
              <Clock className="h-3.5 w-3.5" />
              {new Date(task.endDate).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
            </div>
          </div>

          <div className="flex -space-x-1.5">
            {task.assignees?.map((a: any, i: number) => (
              <div 
                key={i} 
                title={`${a.firstName} ${a.lastName}`}
                className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground shadow-sm"
              >
                {a.firstName?.[0]}{a.lastName?.[0]}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
