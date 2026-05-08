import prisma from '../../config/database';
import { AttendanceStatus } from '@prisma/client';

/**
 * Obtiene el registro de asistencia de hoy para un usuario
 */
export const getTodayAttendance = async (userId: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return await prisma.attendance.findUnique({
    where: {
      userId_date: {
        userId,
        date: today,
      },
    },
  });
};

/**
 * Marca la entrada (Check-in) con validación de horario
 */
export const checkIn = async (userId: string, notes?: string) => {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
  today.setHours(0, 0, 0, 0);

  // 1. Validar si el usuario tiene horario asignado para hoy
  const schedule = await prisma.schedule.findUnique({
    where: {
      userId_dayOfWeek: {
        userId,
        dayOfWeek: dayName as any,
      },
    },
  });

  if (!schedule) {
    throw new Error('No tienes un horario asignado para el día de hoy. Contacta al administrador.');
  }

  if (!schedule.isWorkDay) {
    throw new Error('Hoy no es un día laborable según tu horario asignado.');
  }

  // 2. Verificar si ya existe un registro para hoy
  const existing = await getTodayAttendance(userId);
  if (existing) {
    throw new Error('Ya has marcado tu entrada el día de hoy');
  }

  return await prisma.attendance.create({
    data: {
      userId,
      date: today,
      checkIn: new Date(),
      status: 'CHECKED_IN',
      notes,
    },
  });
};

/**
 * Inicia el descanso (Break Start)
 */
export const startBreak = async (userId: string) => {
  const attendance = await getTodayAttendance(userId);

  if (!attendance) throw new Error('No has marcado tu entrada todavía');
  if (attendance.status !== 'CHECKED_IN') throw new Error('No puedes iniciar un descanso en este estado');

  return await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      breakStart: new Date(),
      status: 'ON_BREAK',
    },
  });
};

/**
 * Finaliza el descanso (Break End)
 */
export const endBreak = async (userId: string) => {
  const attendance = await getTodayAttendance(userId);

  if (!attendance) throw new Error('No has marcado tu entrada todavía');
  if (attendance.status !== 'ON_BREAK') throw new Error('No estás en un descanso actualmente');

  return await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      breakEnd: new Date(),
      status: 'CHECKED_IN',
    },
  });
};

/**
 * Marca la salida (Check-out) y calcula minutos trabajados
 */
export const checkOut = async (userId: string) => {
  const attendance = await getTodayAttendance(userId);

  if (!attendance) throw new Error('No has marcado tu entrada todavía');
  if (attendance.status === 'CHECKED_OUT') throw new Error('Ya has marcado tu salida hoy');

  const now = new Date();
  const checkInTime = attendance.checkIn;
  
  if (!checkInTime) throw new Error('Error en el registro: falta hora de entrada');

  // Cálculo básico de minutos trabajados (CheckOut - CheckIn - (BreakEnd - BreakStart))
  let totalMillis = now.getTime() - checkInTime.getTime();

  // Restar tiempo de descanso si existió
  if (attendance.breakStart && attendance.breakEnd) {
    const breakMillis = attendance.breakEnd.getTime() - attendance.breakStart.getTime();
    totalMillis -= breakMillis;
  } else if (attendance.breakStart && !attendance.breakEnd) {
    // Si olvidó cerrar el descanso, asumimos que terminó ahora
    const breakMillis = now.getTime() - attendance.breakStart.getTime();
    totalMillis -= breakMillis;
  }

  const workedMinutes = Math.floor(totalMillis / (1000 * 60));

  return await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      checkOut: now,
      status: 'CHECKED_OUT',
      workedMinutes,
    },
  });
};

/**
 * Obtiene todos los registros de asistencia (Para Admin)
 */
export const getAllAttendance = async () => {
  return await prisma.attendance.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
          department: true,
        },
      },
    },
    orderBy: {
      date: 'desc',
    },
  });
};
