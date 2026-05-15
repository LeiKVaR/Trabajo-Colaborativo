import { Router } from 'express';
import * as notificationsController from './notifications.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

router.get('/', notificationsController.list);
router.patch('/:id/read', notificationsController.markRead);
router.patch('/read-all', notificationsController.markAllRead);
router.delete('/:id', notificationsController.remove);

export default router;
