export const APP_NAME = "Asistly";

export const ROUTES = {
  // Públicas
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Empleado
  DASHBOARD: "/dashboard",
  ASISTENCIA: "/asistencia",
  TAREAS: "/tareas",
  HORARIOS: "/horarios",
  PERFIL: "/perfil",

  // Admin
  ADMIN: "/admin",
  ADMIN_USUARIOS: "/admin/usuarios",
  ADMIN_TAREAS: "/admin/tareas",
  ADMIN_ASISTENCIA: "/admin/asistencia",
  ADMIN_PERFIL: "/admin/perfil",
} as const;

export const DAY_STATUS_META = {
  present:  { label: "Presente",      dot: "bg-success",  bg: "bg-success/10",  text: "text-success" },
  late:     { label: "Tarde",         dot: "bg-warning",  bg: "bg-warning/10",  text: "text-warning" },
  absent:   { label: "Ausente",       dot: "bg-danger",   bg: "bg-danger/10",   text: "text-danger" },
  remote:   { label: "Remoto",        dot: "bg-primary",  bg: "bg-primary/10",  text: "text-primary" },
  vacation: { label: "Vacaciones",    dot: "bg-accent-foreground", bg: "bg-accent", text: "text-accent-foreground" },
  weekend:  { label: "Fin de semana", dot: "bg-inactive", bg: "bg-muted",       text: "text-muted-foreground" },
  future:   { label: "Pendiente",     dot: "bg-border",   bg: "bg-transparent", text: "text-muted-foreground" },
} as const;

export const TASK_STATUS_META = {
  ASSIGNED:    { label: "Asignada",    dot: "bg-inactive", bg: "bg-muted",       text: "text-muted-foreground" },
  IN_PROGRESS: { label: "En progreso", dot: "bg-warning",  bg: "bg-warning/10",  text: "text-warning" },
  COMPLETED:   { label: "Completada",  dot: "bg-success",  bg: "bg-success/10",  text: "text-success" },
} as const;

export const PRIORITY_META = {
  high:   { label: "Alta",  bg: "bg-danger/10",  text: "text-danger",  border: "border-danger/20" },
  medium: { label: "Media", bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
  low:    { label: "Baja",  bg: "bg-muted",      text: "text-muted-foreground", border: "border-border" },
} as const;
