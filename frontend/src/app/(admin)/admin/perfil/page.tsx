"use client";

import { useAuthStore } from "@/store/auth-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Mail, ShieldAlert, Fingerprint, Activity } from "lucide-react";

export default function AdminPerfilPage() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-danger" />
            Perfil de Administrador
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Configuración de cuenta maestra y seguridad.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Identidad */}
        <Card className="md:col-span-1 border-danger/20 shadow-soft h-fit bg-card/50 overflow-hidden">
          <div className="h-2 bg-danger w-full" />
          <CardContent className="pt-8 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-2xl bg-danger/10 flex items-center justify-center border-2 border-danger/20 shadow-md mb-4 rotate-3 hover:rotate-0 transition-transform">
              <span className="text-4xl font-bold text-danger">
                {user?.firstName?.[0] || "A"}
              </span>
            </div>
            <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <div className="mt-2 px-3 py-1 rounded-full bg-danger/10 text-danger text-[10px] font-bold uppercase tracking-widest border border-danger/20">
              Súper Usuario
            </div>
            
            <div className="w-full pt-6 mt-6 border-t border-border/40 space-y-4 text-sm text-left">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Fingerprint className="h-4 w-4 text-danger" />
                <span className="font-mono text-[11px]">{user?.id}</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-danger" />
                <span className="truncate">{user?.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles y Seguridad */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-border/50 shadow-soft">
            <CardHeader>
              <CardTitle className="text-lg">Información de Acceso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Principal</Label>
                  <Input value={user?.email || ""} className="bg-muted/50" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Último Login</Label>
                  <Input value="Hoy, hace 15 minutos" className="bg-muted/50 font-mono text-xs" disabled />
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-2">Cambiar Contraseña</Button>
            </CardContent>
          </Card>

          <Card className="border-danger/10 shadow-soft bg-danger/[0.02]">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-danger" /> 
                Zona de Riesgo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-danger/20 rounded-lg flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Autenticación de 2 Factores</p>
                  <p className="text-xs text-muted-foreground">Añade una capa extra de seguridad a tu cuenta.</p>
                </div>
                <Button size="sm" className="bg-danger text-white hover:bg-danger/90">Activar</Button>
              </div>
              
              <div className="p-4 border border-border/40 rounded-lg flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Logs de Auditoría</p>
                    <p className="text-xs text-muted-foreground">Ver quién ha entrado al sistema recientemente.</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">Ver Logs</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
