"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Calendar } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AuthUser } from "@/types/auth.types";
import { cn } from "@/lib/utils";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
}

const DAYS = [
  { id: "MONDAY", label: "Lunes" },
  { id: "TUESDAY", label: "Martes" },
  { id: "WEDNESDAY", label: "Miércoles" },
  { id: "THURSDAY", label: "Jueves" },
  { id: "FRIDAY", label: "Viernes" },
  { id: "SATURDAY", label: "Sábado" },
  { id: "SUNDAY", label: "Domingo" },
];

export function ScheduleModal({ isOpen, onClose, user }: ScheduleModalProps) {
  const [loading, setLoading] = useState(false);
  const [schedules, setSchedules] = useState<Record<string, any>>({});

  useEffect(() => {
    if (isOpen && user) {
      fetchUserSchedules();
    }
  }, [isOpen, user]);

  const fetchUserSchedules = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await api.get(`/schedules/user/${user.id}`);
      const data = response.data.data.schedules;
      
      const scheduleMap: Record<string, any> = {};
      DAYS.forEach(day => {
        const found = data.find((s: any) => s.dayOfWeek === day.id);
        scheduleMap[day.id] = found || {
          startTime: "09:00",
          endTime: "18:00",
          isWorkDay: !["SATURDAY", "SUNDAY"].includes(day.id)
        };
      });
      setSchedules(scheduleMap);
    } catch (error) {
      const defaultMap: Record<string, any> = {};
      DAYS.forEach(day => {
        defaultMap[day.id] = {
          startTime: "09:00",
          endTime: "18:00",
          isWorkDay: !["SATURDAY", "SUNDAY"].includes(day.id)
        };
      });
      setSchedules(defaultMap);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (dayId: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], isWorkDay: !prev[dayId].isWorkDay }
    }));
  };

  const handleChange = (dayId: string, field: string, value: string) => {
    setSchedules(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value }
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // Usamos el endpoint BULK del backend
      const schedulesArray = DAYS.map(day => ({
        dayOfWeek: day.id,
        startTime: schedules[day.id].startTime,
        endTime: schedules[day.id].endTime,
        isWorkDay: schedules[day.id].isWorkDay
      }));

      await api.post("/schedules/bulk", {
        userId: user.id,
        schedules: schedulesArray
      });
      
      toast.success(`Horario actualizado para ${user.firstName}`);
      onClose();
    } catch (error) {
      toast.error("Error al guardar horarios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Horario: {(user?.firstName || "")} {(user?.lastName || "")}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-4">
          {DAYS.map((day) => {
            const sched = schedules[day.id] || { startTime: "09:00", endTime: "18:00", isWorkDay: true };
            return (
              <div key={day.id} className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-colors",
                sched.isWorkDay ? "border-primary/20 bg-primary/5" : "border-border bg-muted/20 opacity-60"
              )}>
                <div className="flex items-center gap-4">
                  <Switch 
                    checked={sched.isWorkDay} 
                    onCheckedChange={() => handleToggle(day.id)}
                  />
                  <div className="w-20 font-medium text-sm">{day.label}</div>
                </div>

                <div className="flex items-center gap-2">
                  <Input 
                    type="time" 
                    className="w-28 h-8 text-xs" 
                    disabled={!sched.isWorkDay}
                    value={(sched.startTime || "09:00") as string}
                    onChange={(e) => handleChange(day.id, "startTime", e.target.value)}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input 
                    type="time" 
                    className="w-28 h-8 text-xs" 
                    disabled={!sched.isWorkDay}
                    value={(sched.endTime || "18:00") as string}
                    onChange={(e) => handleChange(day.id, "endTime", e.target.value)}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="pt-4 border-t border-border/40">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Guardar Horario
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
