import { Router } from 'express';
import * as attendanceController from './attendance.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { attendanceNoteSchema } from './attendance.dto';

const router = Router();

// Todas las rutas de asistencia requieren estar autenticado
router.use(authenticate);

// Solo Admin puede ver todos los registros
router.get('/', authorize(['ADMIN']), attendanceController.getAll);

router.get('/status', attendanceController.getStatus);
router.post('/check-in', validate(attendanceNoteSchema), attendanceController.checkIn);
router.post('/break-start', attendanceController.startBreak);
router.post('/break-end', attendanceController.endBreak);
router.post('/check-out', attendanceController.checkOut);

export default router;
