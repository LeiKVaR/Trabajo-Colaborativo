"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import api from "@/lib/axios";
import { toast } from "sonner";
import { AuthUser } from "@/types/auth.types";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTaskModal({ isOpen, onClose, onSuccess }: CreateTaskModalProps) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    priority: "medium",
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    assigneeIds: [] as string[]
  });

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const response = await api.get("/users");
      const usersData = response.data?.data?.users || response.data?.users || [];
      setUsers(usersData.filter((u: any) => u.status === "ACTIVE"));
    } catch (error) {
      toast.error("Error al cargar empleados");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.assigneeIds.length === 0) {
      toast.error("Debes asignar al menos un empleado");
      return;
    }

    setLoading(true);
    try {
      await api.post("/tasks", formData);
      toast.success("Tarea asignada correctamente");
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        title: "",
        description: "",
        requirements: "",
        priority: "medium",
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        assigneeIds: []
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error al crear tarea");
    } finally {
      setLoading(false);
    }
  };

  const toggleUser = (userId: string) => {
    setFormData(prev => ({
      ...prev,
      assigneeIds: prev.assigneeIds.includes(userId)
        ? prev.assigneeIds.filter(id => id !== userId)
        : [...prev.assigneeIds, userId]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Asignar Nueva Tarea</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto px-1 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Título de la Tarea</Label>
            <Input 
              id="title" 
              placeholder="Ej: Revisión de inventario trimestral" 
              required 
              value={(formData.title || "") as string}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridad</Label>
              <Select 
                value={(formData.priority || "medium") as string} 
                onValueChange={(v) => setFormData({...formData, priority: v})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baja</SelectItem>
                  <SelectItem value="medium">Media</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha Límite</Label>
              <Input 
                id="endDate" 
                type="date" 
                required 
                value={(formData.endDate || "") as string}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea 
              id="description" 
              placeholder="Detalles sobre lo que se debe realizar..." 
              value={(formData.description || "") as string}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label>Asignar a Empleados ({formData.assigneeIds.length})</Label>
            <Card className="border-border/60">
              <ScrollArea className="h-[120px] p-2">
                {loadingUsers ? (
                  <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin" /></div>
                ) : (
                  <div className="space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded transition-colors">
                        <Checkbox 
                          id={`user-${user.id}`} 
                          checked={formData.assigneeIds.includes(user.id)}
                          onCheckedChange={() => toggleUser(user.id)}
                        />
                        <Label 
                          htmlFor={`user-${user.id}`} 
                          className="flex-1 flex items-center gap-2 cursor-pointer text-sm font-normal"
                        >
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {(user.firstName || "U")[0]}
                          </div>
                          {(user.firstName || "")} {(user.lastName || "")}
                        </Label>
                      </div>
                    ))}
                    {users.length === 0 && <p className="text-xs text-center text-muted-foreground py-2">No hay empleados activos disponibles</p>}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Crear Tarea
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
