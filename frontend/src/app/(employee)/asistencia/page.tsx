"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Coffee, LogOut, Play, History, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import api from "@/lib/axios";

import { MonthCalendar } from "@/components/asistencia/month-calendar";

// Mapeo de estados del backend a la UI
type BackendStatus = "CHECKED_IN" | "ON_BREAK" | "CHECKED_OUT" | "NONE" | "WORK_IN_PROGRESS";
type ShiftStatus = "IDLE" | "WORKING" | "BREAK" | "DONE";

const statusMap: Record<string, ShiftStatus> = {
  "CHECKED_IN": "WORKING",
  "WORK_IN_PROGRESS": "WORKING",
  "ON_BREAK": "BREAK",
  "CHECKED_OUT": "DONE",
  "NONE": "IDLE",
  "NOT_STARTED": "IDLE"
};

export default function AsistenciaPage() {
  const [status, setStatus] = useState<ShiftStatus>("IDLE");
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cargar estado inicial
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get("/attendance/status");
        const backendStatus = response.data.data.attendance?.status || "NONE";
        setStatus(statusMap[backendStatus] || "IDLE");
      } catch (error) {
        console.error("Error fetching status", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleAction = async (action: string, nextStatus: ShiftStatus, message: string) => {
    try {
      setLoading(true);
      await api.post(`/attendance/${action}`, {});
      setStatus(nextStatus);
      toast.success(message);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error al registrar actividad";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Sección del Reloj Principal */}
      <div className="text-center space-y-2 py-4">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-gradient-primary">
          {currentTime.toLocaleTimeString('es-PE', { hour12: false })}
        </h1>
        <p className="text-muted-foreground font-medium">
          {currentTime.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Control */}
        <Card className="md:col-span-2 shadow-float border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Registro de Jornada</CardTitle>
            <CardDescription>Marca tu actividad actual. Se registrará tu ubicación GPS.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {status === "IDLE" && (
              <Button size="lg" className="h-24 text-lg gap-3 hover-lift shadow-card col-span-2" disabled={loading} onClick={() => handleAction("check-in", "WORKING", "Entrada registrada")}>
                <Play className="h-6 w-6 fill-current" /> Iniciar Turno
              </Button>
            )}

            {status === "WORKING" && (
              <>
                <Button size="lg" variant="outline" className="h-24 text-lg gap-3 hover-lift border-warning/50 text-warning hover:bg-warning/10" disabled={loading} onClick={() => handleAction("break-start", "BREAK", "Descanso iniciado")}>
                  <Coffee className="h-6 w-6" /> Tomar Break
                </Button>
                <Button size="lg" variant="outline" className="h-24 text-lg gap-3 hover-lift border-danger/50 text-danger hover:bg-danger/10" disabled={loading} onClick={() => handleAction("check-out", "DONE", "Salida registrada")}>
                  <LogOut className="h-6 w-6" /> Finalizar Turno
                </Button>
              </>
            )}

            {status === "BREAK" && (
              <Button size="lg" className="h-24 text-lg gap-3 hover-lift col-span-2" disabled={loading} onClick={() => handleAction("break-end", "WORKING", "Retorno al trabajo registrado")}>
                <Play className="h-6 w-6 fill-current" /> Terminar Break
              </Button>
            )}

            {status === "DONE" && (
              <div className="col-span-2 p-6 bg-success/10 border border-success/20 rounded-xl text-center">
                <p className="text-success font-semibold">¡Jornada completada!</p>
                <p className="text-sm text-success/80">Has registrado tu salida exitosamente.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card de Info Lateral */}
        <div className="space-y-6">
          <Card className="shadow-card border-border/60">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Independencia, Lima</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Horas hoy:</span>
                  <span className="font-mono font-bold">07:45:22</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    status === "WORKING" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"
                  )}>
                    {status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <MonthCalendar />
        </div>

        <div className="lg:col-span-2">
          {/* Historial Reciente */}
          <Card className="border-border/40 shadow-soft overflow-hidden h-full">
            <CardHeader className="bg-muted/30">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Registros recientes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/40">
                {[
                  { label: "Entrada", time: "09:00 AM", date: "Hoy" },
                  { label: "Salida", time: "18:05 PM", date: "Ayer" },
                  { label: "Entrada", time: "08:55 AM", date: "Ayer" },
                  { label: "Salida", time: "18:10 PM", date: "02 May" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{log.label}</p>
                        <p className="text-xs text-muted-foreground">{log.date}</p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-semibold">{log.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
