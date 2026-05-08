import { Request, Response, NextFunction } from 'express';
import * as tasksService from './tasks.service';

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await tasksService.createTask(req.body);
    res.status(201).json({ status: 'success', data: { task } });
  } catch (error) {
    next(error);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;

    let tasks;
    if (role === 'ADMIN') {
      tasks = await tasksService.getAllTasks();
    } else {
      tasks = await tasksService.getUserTasks(userId);
    }

    res.status(200).json({ status: 'success', data: { tasks } });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const task = await tasksService.updateTaskStatus(id as string, status);
    res.status(200).json({ status: 'success', data: { task } });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user!.id;
    const comment = await tasksService.addComment(id as string, authorId, content);
    res.status(201).json({ status: 'success', data: { comment } });
  } catch (error) {
    next(error);
  }
};
