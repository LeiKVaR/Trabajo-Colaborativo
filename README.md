# 📋 Sistema de Asistencia y Gestión de Tareas

Este proyecto es un sistema de gestión de asistencia laboral y tareas colaborativas construido con **Next.js 14**, **Express.js**, **Prisma ORM** y **PostgreSQL** (vía Supabase).

## 🚀 Estructura del Proyecto

```
Trabajo-Colaborativo/
├── frontend/          # Aplicación Next.js 14 (App Router)
└── backend/           # API Express.js con Prisma
```

## 🛠️ Configuración Inicial

### 1. Backend (API)

1. Entra a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Configura las variables de entorno:
   - Copia el archivo `.env.example` (si existe) a `.env` o crea uno nuevo.
   - **IMPORTANTE:** Obtén tu URL de conexión de **Supabase** (PostgreSQL) y añádela:
     ```env
     DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"
     JWT_SECRET="un_secreto_muy_seguro"
     ```
3. Genera el cliente de Prisma:
   ```bash
   npm run prisma:generate
   ```
4. Ejecuta las migraciones para crear las tablas en Supabase:
   ```bash
   npm run prisma:migrate
   ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### 2. Frontend (Web)

1. Entra a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Configura las variables de entorno en `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:4000/api"
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📦 Despliegue

- **Backend:** Recomendado en **Render** o **Railway**.
- **Frontend:** Recomendado en **Vercel**.
- **Base de Datos:** **Supabase** (PostgreSQL).

## 📄 Documentación

Consulta el archivo `sistema_asistencia_docs.md` para ver los detalles técnicos, modelos de datos y endpoints de la API.

## 📑 Referencia de la API

La API base es `http://localhost:4000/api`. Casi todos los endpoints requieren un **Bearer Token** en el header `Authorization`.

### 🔐 Autenticación (`/auth`)
- `POST /auth/register`: Registro de nuevos usuarios.
- `POST /auth/login`: Login para obtener tokens.
- `POST /auth/refresh`: Renovar el `accessToken` usando un `refreshToken`.
- `POST /auth/logout`: Invalidar el `refreshToken`.

### 👤 Usuarios (`/users`)
- `GET /users`: Listar todos los usuarios (Solo Admin).
- `GET /users/pending`: Ver usuarios en espera de aprobación (Solo Admin).
- `PATCH /users/:id/status`: Cambiar estado de usuario (`ACTIVE`, `REJECTED`, `INACTIVE`).

### 📅 Asistencia (`/attendance`)
- `GET /attendance/status`: Ver estado de mi asistencia hoy.
- `GET /attendance`: Ver historial de todos los empleados (Solo Admin).
- `POST /attendance/check-in`: Marcar entrada (Requiere tener horario asignado hoy).
- `POST /attendance/break-start`: Iniciar descanso.
- `POST /attendance/break-end`: Terminar descanso.
- `POST /attendance/check-out`: Marcar salida (Calcula minutos trabajados).

### 📝 Tareas (`/tasks`)
- `GET /tasks`: Listar tareas (Admin ve todas, User solo las suyas).
- `POST /tasks`: Crear nueva tarea y asignar usuarios (Solo Admin).
- `PATCH /tasks/:id/status`: Actualizar estado de tarea (`ASSIGNED`, `IN_PROGRESS`, `COMPLETED`).
- `POST /tasks/:id/comments`: Añadir comentario a una tarea.

### ⏰ Horarios (`/schedules`)
- `GET /schedules/my`: Ver mi horario semanal.
- `GET /schedules/user/:userId`: Ver horario de un empleado (Solo Admin).
- `POST /schedules/bulk`: Configuración masiva de horario semanal para un usuario (Solo Admin).

### 🔔 Notificaciones (`/notifications`)
- `GET /notifications`: Ver mis notificaciones.
- `PATCH /notifications/:id/read`: Marcar notificación como leída.