"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DEPARTMENTS = [
  { name: "Sistemas", employees: 12, attendance: "95%", color: "bg-primary" },
  { name: "Ventas", employees: 8, attendance: "88%", color: "bg-success" },
  { name: "Recursos Humanos", employees: 4, attendance: "100%", color: "bg-warning" },
  { name: "Marketing", employees: 6, attendance: "82%", color: "bg-danger" },
];

export function DepartmentOverview({ users = [] }: { users?: any[] }) {
  // Agrupar usuarios por departamento
  const stats = users.reduce((acc: any, user: any) => {
    const dept = user.department || "Sin asignar";
    if (!acc[dept]) acc[dept] = 0;
    acc[dept]++;
    return acc;
  }, {});

  const departments = Object.entries(stats).map(([name, count]) => ({
    name,
    employees: count as number,
    percentage: users.length > 0 ? ((count as number) / users.length) * 100 : 0,
    color: name === "Sistemas" ? "bg-primary" : name === "Ventas" ? "bg-success" : name === "Recursos Humanos" ? "bg-warning" : "bg-danger"
  }));

  return (
    <Card className="border-border/50 shadow-soft h-full">
      <CardHeader className="pb-4 border-b border-border/40">
        <CardTitle className="text-lg">Resumen por Departamento</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-5">
          {departments.length > 0 ? (
            departments.map((dept, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{dept.name}</span>
                  <span className="text-muted-foreground">{dept.employees} empleados</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-1000", dept.color)}
                    style={{ width: `${dept.percentage}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No hay datos de departamentos disponibles.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
