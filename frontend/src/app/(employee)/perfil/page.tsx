"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserCircle, Mail, Briefcase, Building2, Key, Bell } from "lucide-react";

export default function PerfilPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <UserCircle className="h-6 w-6 text-primary" />
          Mi Perfil
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gestiona tu información personal y preferencias de la cuenta.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tarjeta de Resumen (Izquierda) */}
        <Card className="md:col-span-1 border-border/50 shadow-soft h-fit">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-md mb-4 relative">
              <span className="text-4xl font-bold text-primary">
                {user?.firstName?.[0] || "U"}
              </span>
              <div className="absolute bottom-1 right-1 h-4 w-4 bg-success rounded-full border-2 border-background"></div>
            </div>
            <h2 className="text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{user?.position || "Miembro del equipo"}</p>
            
            <div className="w-full pt-4 border-t border-border/40 space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{user?.department || "Operaciones"}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulario de Datos (Derecha) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Información Personal</CardTitle>
              <CardDescription>Tus datos están sincronizados con el sistema de RRHH.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombres</Label>
                  <Input value={user?.firstName || ""} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Apellidos</Label>
                  <Input value={user?.lastName || ""} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>Correo Corporativo</Label>
                  <Input value={user?.email || ""} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label>ID de Empleado</Label>
                  <Input value={user?.id || ""} disabled className="bg-muted/50 font-mono" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                <Briefcase className="h-3 w-3" /> Para actualizar estos datos, contacta a tu administrador.
              </p>
            </CardContent>
          </Card>

          {/* Tarjeta de Preferencias (Configuraciones UI) */}
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Preferencias</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Notificaciones Push</p>
                    <p className="text-xs text-muted-foreground">Recibe alertas sobre tus turnos y tareas.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Configurar</Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border/40 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Contraseña</p>
                    <p className="text-xs text-muted-foreground">Última actualización hace 30 días.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Cambiar</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
