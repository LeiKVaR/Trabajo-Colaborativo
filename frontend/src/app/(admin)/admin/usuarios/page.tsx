"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus, Shield, User, Check, X, MoreHorizontal, Loader2, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AuthUser } from "@/types/auth.types";
import { ScheduleModal } from "@/components/admin/schedule-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsuariosAdminPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const assignDepartment = async (userId: string, department: string) => {
    try {
      await api.patch(`/users/${userId}`, { department });
      toast.success(`Departamento asignado: ${department}`);
      fetchUsers(); // Recargar lista
    } catch (error) {
      toast.error("Error al asignar departamento");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      // Extraer datos con máxima flexibilidad
      let usersData = [];
      if (Array.isArray(response.data)) {
        usersData = response.data;
      } else if (response.data?.data?.users) {
        usersData = response.data.data.users;
      } else if (response.data?.users) {
        usersData = response.data.users;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersData = response.data.data;
      }
      
      setUsers(usersData);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      const statusCode = error.response?.status;
      const apiMessage = error.response?.data?.message;
      const message = apiMessage 
        ? `${apiMessage} (Status: ${statusCode})` 
        : `Error al cargar usuarios (Status: ${statusCode || "Network Error"})`;
      
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/users/${id}/status`, { status });
      toast.success(status === "ACTIVE" ? "Usuario aprobado" : "Estado actualizado");
      fetchUsers(); // Recargar lista
    } catch (error) {
      toast.error("Error al actualizar estado");
    }
  };

  const filteredUsers = users.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <ScheduleModal 
        isOpen={isScheduleModalOpen} 
        onClose={() => setIsScheduleModalOpen(false)} 
        user={selectedUser} 
      />
      {/* Header y Buscador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-muted-foreground mt-1">Administra accesos y roles del equipo.</p>
        </div>
        <Button 
          className="hover-lift gap-2 shadow-card"
          onClick={() => toast.info("Para agregar empleados, por ahora usa la página de Registro (/register).")}
        >
          <UserPlus className="h-4 w-4" /> Agregar Empleado
        </Button>
      </div>

      <Card className="border-border/50 shadow-soft bg-card/50">
        <CardHeader className="pb-4 border-b border-border/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg">Directorio de Personal</CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar por nombre o correo..." 
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
                  <th className="px-6 py-4 font-medium">Usuario</th>
                  <th className="px-6 py-4 font-medium">Departamento</th>
                  <th className="px-6 py-4 font-medium">Rol</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 stagger">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                    {/* Celda: Usuario (Avatar + Nombre + Email) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shadow-inner border border-background",
                          user.role === "ADMIN" ? "bg-danger/20 text-danger" : "bg-primary/20 text-primary"
                        )}>
                          {(user.firstName || "U")[0]}{(user.lastName || "U")[0]}
                        </div>
                        <div>
                          <p className="font-semibold">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Celda: Departamento */}
                    <td className="px-6 py-4">
                      <Select 
                        value={user.department || "unassigned"} 
                        onValueChange={(value) => assignDepartment(user.id, value === "unassigned" ? "" : value)}
                      >
                        <SelectTrigger className="h-8 w-full min-w-[140px] bg-transparent border-none hover:bg-muted/50 focus:ring-0 text-sm text-muted-foreground p-0">
                          <SelectValue placeholder="Sin asignar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Sin asignar</SelectItem>
                          <SelectItem value="Sistemas">Sistemas</SelectItem>
                          <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                          <SelectItem value="Contabilidad">Contabilidad</SelectItem>
                          <SelectItem value="Operaciones">Operaciones</SelectItem>
                          <SelectItem value="Ventas">Ventas</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Celda: Rol */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        {user.role === "ADMIN" ? (
                          <Shield className="h-4 w-4 text-danger" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                        <span className="capitalize font-medium">{user.role.toLowerCase()}</span>
                      </div>
                    </td>

                    {/* Celda: Estado (Condicional) */}
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border",
                        user.status === "ACTIVE" && "bg-success/10 text-success border-success/20",
                        user.status === "PENDING" && "bg-warning/10 text-warning border-warning/20",
                        user.status === "INACTIVE" && "bg-muted text-muted-foreground border-border/50"
                      )}>
                        {user.status === "ACTIVE" ? "Activo" : user.status === "PENDING" ? "Pendiente" : "Inactivo"}
                      </span>
                    </td>

                    {/* Celda: Acciones */}
                    <td className="px-6 py-4 text-right">
                      {user.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 text-success hover:bg-success/10 hover:text-success border-success/30" onClick={() => handleUpdateStatus(user.id, "ACTIVE")}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8 text-danger hover:bg-danger/10 hover:text-danger border-danger/30" onClick={() => handleUpdateStatus(user.id, "REJECTED")}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsScheduleModalOpen(true);
                            }}
                            title="Gestionar Horario"
                          >
                            <Calendar className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuLabel>Asignar Departamento</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => assignDepartment(user.id, "Sistemas")}>
                                Sistemas
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => assignDepartment(user.id, "Recursos Humanos")}>
                                Recursos Humanos
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => assignDepartment(user.id, "Contabilidad")}>
                                Contabilidad
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => assignDepartment(user.id, "Operaciones")}>
                                Operaciones
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => assignDepartment(user.id, "Ventas")}>
                                Ventas
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-danger focus:text-danger focus:bg-danger/10">
                                Desactivar Usuario
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-muted-foreground">
                      No se encontraron usuarios con ese criterio de búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
