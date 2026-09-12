import { Router } from 'express';
import studentRoutes from './student.routes';
import noticeRoutes from './notice.routes';
import opportunityRoutes from './opportunity.routes';
import taskRoutes from './task.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/students', studentRoutes);
router.use('/notices', noticeRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
