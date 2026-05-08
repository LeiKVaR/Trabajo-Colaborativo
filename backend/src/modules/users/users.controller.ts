import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const listPending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await usersService.getPendingUsers();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request<{ id: string }, {}, { status: 'ACTIVE' | 'REJECTED' | 'INACTIVE' }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await usersService.updateUserStatus(id, status);
    res.status(200).json({ status: 'success', message: `Estado actualizado a ${status} correctamente`, data: { user } });
  } catch (error) {
    next(error);
  }
};
