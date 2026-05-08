import prisma from '../../config/database';

/**
 * Crea una notificación para un usuario
 */
export const createNotification = async (userId: string, title: string, message: string, type: string) => {
  return await prisma.notification.create({
    data: {
      userId,
      title,
      message,
      type,
    },
  });
};

/**
 * Obtiene todas las notificaciones de un usuario
 */
export const getUserNotifications = async (userId: string) => {
  return await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

/**
 * Marca una notificación como leída
 */
export const markAsRead = async (notificationId: string) => {
  return await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
};

/**
 * Marca todas las notificaciones de un usuario como leídas
 */
export const markAllAsRead = async (userId: string) => {
  return await prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
};
