import { Request, Response, NextFunction } from 'express';
import * as notificationsService from './notifications.service';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const notifications = await notificationsService.getUserNotifications(userId);
    res.status(200).json({ status: 'success', data: { notifications } });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const notification = await notificationsService.markAsRead(id as string);
    res.status(200).json({ status: 'success', data: { notification } });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    await notificationsService.markAllAsRead(userId);
    res.status(200).json({ status: 'success', message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await notificationsService.deleteNotification(id as string);
    res.status(200).json({ status: 'success', message: 'Notificación eliminada' });
  } catch (error) {
    next(error);
  }
};
