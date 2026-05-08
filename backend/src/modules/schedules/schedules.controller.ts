import { Request, Response, NextFunction } from 'express';
import * as schedulesService from './schedules.service';
import { BulkScheduleInput } from './schedules.dto';

export const getMySchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const schedule = await schedulesService.getUserSchedule(userId);
    res.status(200).json({ status: 'success', data: { schedule } });
  } catch (error) {
    next(error);
  }
};

export const getUserSchedule = async (req: Request<{ userId: string }>, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const schedule = await schedulesService.getUserSchedule(userId);
    res.status(200).json({ status: 'success', data: { schedule } });
  } catch (error) {
    next(error);
  }
};

export const setBulk = async (req: Request<{}, {}, BulkScheduleInput>, res: Response, next: NextFunction) => {
  try {
    const schedules = await schedulesService.setBulkSchedules(req.body);
    res.status(200).json({ status: 'success', message: 'Horario actualizado correctamente', data: { schedules } });
  } catch (error) {
    next(error);
  }
};
