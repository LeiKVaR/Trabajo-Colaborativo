import { Router } from 'express';
import * as schedulesController from './schedules.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { bulkScheduleSchema, userIdParamSchema } from './schedules.dto';

const router = Router();

router.use(authenticate);

// Un empleado puede ver su propio horario
router.get('/my', schedulesController.getMySchedule);

// Solo Admin puede ver horarios de otros
router.get('/user/:userId', authorize('ADMIN'), validate(userIdParamSchema), schedulesController.getUserSchedule);

// Solo Admin puede configurar horarios
router.post('/bulk', authorize('ADMIN'), validate(bulkScheduleSchema), schedulesController.setBulk);

export default router;
