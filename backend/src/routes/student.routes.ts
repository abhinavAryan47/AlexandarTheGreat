import { Router } from 'express';
import { studentController } from '../controllers/student.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createStudentSchema, updateStudentSchema } from '../schemas/student.schema';

const router = Router();

router.get('/', studentController.getAll);
router.get('/:id', studentController.getById);
router.post('/', validateRequest(createStudentSchema), studentController.create);
router.patch('/:id', validateRequest(updateStudentSchema), studentController.update);
router.delete('/:id', studentController.delete);

export default router;
