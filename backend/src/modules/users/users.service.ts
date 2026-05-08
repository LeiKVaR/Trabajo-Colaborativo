import prisma from '../../config/database';
import { createNotification } from '../notifications/notifications.service';

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      status: true,
      position: true,
      department: true,
      createdAt: true,
    },
  });
};

export const getPendingUsers = async () => {
  return prisma.user.findMany({
    where: { status: 'PENDING' },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      createdAt: true,
    },
  });
};

export const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'REJECTED' | 'INACTIVE') => {
  // 1. Verificar si el usuario existe
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error('No se encontró el usuario con el ID proporcionado');
  }

  // 2. Actualizar el estado
  const user = await prisma.user.update({
    where: { id: userId },
    data: { status },
  });

  if (status === 'ACTIVE') {
    await createNotification(
      userId,
      '¡Cuenta Aprobada!',
      'Tu cuenta ha sido aprobada por el administrador. Ya puedes usar todas las funciones del sistema.',
      'registration_approved'
    );
  }

  return user;
};

export const updateUser = async (userId: string, data: any) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existingUser) {
    throw new Error('No se encontró el usuario');
  }

  return prisma.user.update({
    where: { id: userId },
    data,
  });
};
