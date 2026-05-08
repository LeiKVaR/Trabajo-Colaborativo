import { Router } from 'express';
import * as tasksController from './tasks.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import { validate } from '../../middlewares/validate';
import { createTaskSchema, updateTaskStatusSchema } from './tasks.dto';

const router = Router();

router.use(authenticate);

// Listar tareas (Admin ve todas, Empleado solo las suyas)
router.get('/', tasksController.list);

// Crear tarea (Solo Admin)
router.post('/', authorize('ADMIN'), validate(createTaskSchema), tasksController.create);

// Actualizar estado (Cualquiera asignado)
router.patch('/:id/status', validate(updateTaskStatusSchema), tasksController.updateStatus);

// Comentar (Cualquiera asignado)
router.post('/:id/comments', tasksController.addComment);

export default router;
