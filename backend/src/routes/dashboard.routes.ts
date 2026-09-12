import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';

const router = Router();

router.get('/:studentId', dashboardController.getStudentDashboard);

export default router;
