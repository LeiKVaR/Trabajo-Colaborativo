import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRouter from './modules/auth/auth.router';
import usersRouter from './modules/users/users.router';
import attendanceRouter from './modules/attendance/attendance.router';
import tasksRouter from './modules/tasks/tasks.router';
import schedulesRouter from './modules/schedules/schedules.router';
import notificationsRouter from './modules/notifications/notifications.router';
import { errorHandler } from './middlewares/errorHandler';

dotenv.config();

const app: Application = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/attendance', attendanceRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/notifications', notificationsRouter);

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to Attendance System API' });
});

// Error Handler
app.use(errorHandler);

export default app;

