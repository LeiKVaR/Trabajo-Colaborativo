import prisma from '../../config/database';
import { CreateTaskInput } from './tasks.dto';
import { TaskStatus } from '@prisma/client';
import { createNotification } from '../notifications/notifications.service';

/**
 * Crea una tarea y la asigna a múltiples usuarios
 */
export const createTask = async (data: CreateTaskInput) => {
  const { assignedUserIds, ...taskData } = data;

  // 1. Validar que todos los usuarios existan antes de intentar asignar
  const existingUsers = await prisma.user.findMany({
    where: {
      id: { in: assignedUserIds },
    },
    select: { id: true },
  });

  if (existingUsers.length !== assignedUserIds.length) {
    throw new Error('Uno o más usuarios asignados no existen en el sistema');
  }

  const task = await prisma.$transaction(async (tx) => {
    // 2. Crear la tarea
    const newTask = await tx.task.create({
      data: {
        title: taskData.title,
        description: taskData.description,
        requirements: taskData.requirements,
        startDate: new Date(taskData.startDate),
        endDate: new Date(taskData.endDate),
      },
    });

    // 3. Crear las asignaciones
    const assignments = assignedUserIds.map((userId) => ({
      taskId: newTask.id,
      userId,
    }));

    await tx.taskAssignment.createMany({
      data: assignments,
    });

    return newTask;
  });

  // 4. Notificar a los usuarios asignados
  for (const userId of assignedUserIds) {
    await createNotification(
      userId,
      'Nueva Tarea Asignada',
      `Se te ha asignado la tarea: ${taskData.title}`,
      'task_assigned'
    );
  }

  return task;
};

/**
 * Obtiene todas las tareas (Para Admin)
 */
export const getAllTasks = async () => {
  return await prisma.task.findMany({
    include: {
      assignments: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
        },
      },
    },
  });
};

/**
 * Obtiene las tareas asignadas a un usuario específico
 */
export const getUserTasks = async (userId: string) => {
  return await prisma.task.findMany({
    where: {
      assignments: {
        some: { userId },
      },
    },
    include: {
      assignments: {
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      },
    },
  });
};

/**
 * Actualiza el estado de una tarea
 */
export const updateTaskStatus = async (taskId: string, status: TaskStatus) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });
};

/**
 * Agrega un comentario a una tarea
 */
export const addComment = async (taskId: string, authorId: string, content: string) => {
  return await prisma.taskComment.create({
    data: {
      taskId,
      authorId,
      content,
    },
  });
};
