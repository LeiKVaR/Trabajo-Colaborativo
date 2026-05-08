"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Coffee, Square, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";

export function AttendanceCard() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Reloj en tiempo real
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await api.get("/attendance/status");
      setStatus(response.data.data.attendance);
    } catch (error) {
      console.error("Error fetching attendance status", error);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAction = async (action: "check-in" | "break-start" | "break-end" | "check-out") => {
    setLoading(true);
    try {
      await api.post(`/attendance/${action}`);
      toast.success("Acción registrada correctamente");
      fetchStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al registrar acción");
    } finally {
      setLoading(false);
    }
  };

  const currentStatus = status?.status || "NOT_STARTED";

  return (
    <Card className="border-border/50 shadow-soft overflow-hidden">
      <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Asistencia Diaria
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold tracking-tighter">
              {currentTime.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
              Hora Local
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="flex flex-col items-center justify-center p-6 bg-muted/30 rounded-2xl border border-dashed border-border/60">
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Estado Actual</span>
          <div className={cn(
            "px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2",
            currentStatus === "WORK_IN_PROGRESS" && "bg-success/10 text-success border-success/30",
            currentStatus === "ON_BREAK" && "bg-warning/10 text-warning border-warning/30",
            currentStatus === "COMPLETED" && "bg-primary/10 text-primary border-primary/30",
            currentStatus === "NOT_STARTED" && "bg-muted text-muted-foreground border-border/50"
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full animate-pulse",
              currentStatus === "WORK_IN_PROGRESS" && "bg-success",
              currentStatus === "ON_BREAK" && "bg-warning",
              currentStatus === "COMPLETED" && "bg-primary",
              currentStatus === "NOT_STARTED" && "bg-muted-foreground"
            )} />
            {currentStatus === "WORK_IN_PROGRESS" && "Laborando"}
            {currentStatus === "ON_BREAK" && "En Receso"}
            {currentStatus === "COMPLETED" && "Jornada Finalizada"}
            {currentStatus === "NOT_STARTED" && "Sin Iniciar"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentStatus === "NOT_STARTED" && (
            <Button 
              className="col-span-2 h-14 text-base gap-2 shadow-card hover-lift" 
              onClick={() => handleAction("check-in")}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
              Marcar Entrada
            </Button>
          )}

          {currentStatus === "WORK_IN_PROGRESS" && (
            <>
              <Button 
                variant="outline" 
                className="h-12 gap-2 border-warning/30 hover:bg-warning/10 hover:text-warning" 
                onClick={() => handleAction("break-start")}
                disabled={loading}
              >
                <Coffee className="h-4 w-4" /> Almuerzo
              </Button>
              <Button 
                variant="destructive" 
                className="h-12 gap-2 shadow-sm" 
                onClick={() => handleAction("check-out")}
                disabled={loading}
              >
                <Square className="h-4 w-4 fill-current" /> Salida
              </Button>
            </>
          )}

          {currentStatus === "ON_BREAK" && (
            <Button 
              className="col-span-2 h-14 text-base gap-2 bg-success hover:bg-success/90 shadow-card" 
              onClick={() => handleAction("break-end")}
              disabled={loading}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 fill-current" />}
              Retomar Labores
            </Button>
          )}

          {currentStatus === "COMPLETED" && (
            <div className="col-span-2 flex flex-col items-center py-4 text-success">
              <CheckCircle2 className="h-12 w-12 mb-2" />
              <span className="font-bold">¡Buen trabajo hoy!</span>
              <span className="text-xs text-muted-foreground">Tu asistencia ha sido registrada.</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
