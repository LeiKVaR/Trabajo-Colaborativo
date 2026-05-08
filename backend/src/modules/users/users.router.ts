import { Router } from 'express';
import * as usersController from './users.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// All user routes are protected and for ADMIN only
router.use(authenticate);
router.use(authorize(['ADMIN']));

router.get('/', usersController.list);
router.get('/pending', usersController.listPending);
router.patch('/:id/status', usersController.updateStatus);
router.patch('/:id', usersController.update);

export default router;
