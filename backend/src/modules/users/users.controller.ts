import { Request, Response, NextFunction } from 'express';
import { getAllUsers, getPendingUsers, updateUserStatus, updateUser } from './users.service';

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const listPending = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getPendingUsers();
    res.status(200).json({ status: 'success', data: { users } });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request<{ id: string }, {}, { status: 'ACTIVE' | 'REJECTED' | 'INACTIVE' }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const user = await updateUserStatus(id, status);
    res.status(200).json({ status: 'success', message: `Estado actualizado a ${status} correctamente`, data: { user } });
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await updateUser(id, req.body);
    res.status(200).json({ status: 'success', data: { user } });
  } catch (error) {
    next(error);
  }
};
