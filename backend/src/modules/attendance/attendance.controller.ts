import { Request, Response, NextFunction } from 'express';
import * as attendanceService from './attendance.service';

export const getStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const attendance = await attendanceService.getTodayAttendance(userId);
    res.status(200).json({ status: 'success', data: { attendance } });
  } catch (error) {
    next(error);
  }
};

export const checkIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const { notes } = req.body;
    const attendance = await attendanceService.checkIn(userId, notes);
    res.status(201).json({ status: 'success', message: 'Entrada marcada correctamente', data: { attendance } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const startBreak = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const attendance = await attendanceService.startBreak(userId);
    res.status(200).json({ status: 'success', message: 'Descanso iniciado', data: { attendance } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const endBreak = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const attendance = await attendanceService.endBreak(userId);
    res.status(200).json({ status: 'success', message: 'Descanso finalizado', data: { attendance } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const checkOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const attendance = await attendanceService.checkOut(userId);
    res.status(200).json({ status: 'success', message: 'Salida marcada correctamente', data: { attendance } });
  } catch (error: any) {
    res.status(400).json({ status: 'error', message: error.message });
  }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const attendance = await attendanceService.getAllAttendance();
    res.status(200).json({ status: 'success', data: { attendance } });
  } catch (error) {
    next(error);
  }
};
