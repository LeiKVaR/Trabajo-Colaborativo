import { z } from 'zod';

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
    description: z.string().optional(),
    requirements: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high', 'LOW', 'MEDIUM', 'HIGH']).optional().default('medium'),
    startDate: z.string().optional(),
    endDate: z.string(),
    assigneeIds: z.array(z.string()).min(1, 'Debes asignar la tarea al menos a un usuario'),
  }),
});

export const updateTaskStatusSchema = z.object({
  body: z.object({
    status: z.enum(['ASSIGNED', 'IN_PROGRESS', 'COMPLETED']),
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
