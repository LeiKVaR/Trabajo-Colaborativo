"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Clock, Calendar, MapPin, User, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import { HistoryTable } from "@/components/asistencia/history-table";

export default function AdminAsistenciaPage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const response = await api.get("/attendance");
        setAttendance(response.data.data.attendance);
      } catch (error) {
        toast.error("Error al cargar registros de asistencia");
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const filtered = attendance.filter((a: any) => 
    `${a.user.firstName} ${a.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registro de Asistencia Global</h1>
        <p className="text-sm text-muted-foreground mt-1">Supervisa las entradas, salidas y breaks de todo el personal.</p>
      </div>

      <Card className="border-border/50 shadow-soft bg-card/50">
        <CardHeader className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">Historial Completo</CardTitle>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre de empleado..." 
              className="pl-9 bg-background/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <HistoryTable data={filtered} />
        </CardContent>
      </Card>
    </div>
  );
}
