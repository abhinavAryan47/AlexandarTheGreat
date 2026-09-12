import { Router } from 'express';
import { noticeController } from '../controllers/notice.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createNoticeSchema, updateNoticeSchema } from '../schemas/notice.schema';
import { noticeAnalysisRequestSchema } from '../ai/schemas/ai-output.schema';

const router = Router();

router.get('/', noticeController.getAll);
router.post('/analyze', validateRequest(noticeAnalysisRequestSchema), noticeController.analyze);
router.get('/:id', noticeController.getById);
router.post('/', validateRequest(createNoticeSchema), noticeController.create);
router.patch('/:id', validateRequest(updateNoticeSchema), noticeController.update);
router.delete('/:id', noticeController.delete);

export default router;
