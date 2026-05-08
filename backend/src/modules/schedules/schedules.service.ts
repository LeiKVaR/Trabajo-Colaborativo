import prisma from '../../config/database';
import { BulkScheduleInput, ScheduleInput } from './schedules.dto';

/**
 * Crea o actualiza el horario de un día específico
 */
export const upsertSchedule = async (data: ScheduleInput) => {
  return await prisma.schedule.upsert({
    where: {
      userId_dayOfWeek: {
        userId: data.userId,
        dayOfWeek: data.dayOfWeek,
      },
    },
    update: {
      startTime: data.startTime,
      endTime: data.endTime,
      isWorkDay: data.isWorkDay,
    },
    create: {
      userId: data.userId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      isWorkDay: data.isWorkDay,
    },
  });
};

/**
 * Configura el horario de toda la semana para un usuario
 */
export const setBulkSchedules = async (data: BulkScheduleInput) => {
  const { userId, schedules } = data;

  // 1. Validar que el usuario exista
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error('El usuario especificado no existe en el sistema');
  }

  // 2. Usamos una transacción para asegurar que todo se guarde correctamente
  return await prisma.$transaction(
    schedules.map((s) =>
      prisma.schedule.upsert({
        where: {
          userId_dayOfWeek: {
            userId,
            dayOfWeek: s.dayOfWeek,
          },
        },
        update: {
          startTime: s.startTime,
          endTime: s.endTime,
          isWorkDay: s.isWorkDay,
        },
        create: {
          userId,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime,
          isWorkDay: s.isWorkDay,
        },
      })
    )
  );
};

/**
 * Obtiene el horario de un usuario
 */
export const getUserSchedule = async (userId: string) => {
  return await prisma.schedule.findMany({
    where: { userId },
    orderBy: {
      dayOfWeek: 'asc',
    },
  });
};
