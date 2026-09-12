import { Router } from 'express';
import { opportunityController } from '../controllers/opportunity.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { createOpportunitySchema, updateOpportunitySchema } from '../schemas/opportunity.schema';

const router = Router();

router.get('/', opportunityController.getAll);
router.get('/:id', opportunityController.getById);
router.post('/', validateRequest(createOpportunitySchema), opportunityController.create);
router.patch('/:id', validateRequest(updateOpportunitySchema), opportunityController.update);
router.delete('/:id', opportunityController.delete);

// Student Evaluation Endpoints
router.post('/:id/evaluate/:studentId', opportunityController.evaluateForStudent);
router.get('/:id/evaluate/:studentId', opportunityController.evaluateForStudent);

export default router;
