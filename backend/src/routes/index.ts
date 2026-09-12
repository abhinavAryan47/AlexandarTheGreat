import { Router } from 'express';
import studentRoutes from './student.routes';
import noticeRoutes from './notice.routes';
import opportunityRoutes from './opportunity.routes';
import taskRoutes from './task.routes';
import dashboardRoutes from './dashboard.routes';
import calendarRoutes from './calendar.routes';
import agentRoutes from './agent.routes';

const router = Router();

router.use('/students', studentRoutes);
router.use('/notices', noticeRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/calendar', calendarRoutes);
router.use('/agent', agentRoutes);

export default router;
