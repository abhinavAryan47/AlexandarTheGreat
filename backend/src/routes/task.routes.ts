import { Router } from 'express';
import { taskController } from '../controllers/task.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';

const router = Router();

router.get('/', taskController.getAll);
router.post('/from-notice', taskController.createFromNotice);
router.get('/student/:studentId', taskController.getByStudentId);
router.get('/:id', taskController.getById);
router.post('/', validateRequest(createTaskSchema), taskController.create);
router.patch('/:id', validateRequest(updateTaskSchema), taskController.update);
router.delete('/:id', taskController.delete);

export default router;
