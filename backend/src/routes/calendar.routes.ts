import { Router } from 'express';
import { calendarController } from '../controllers/calendar.controller';

const router = Router();

router.post('/create', calendarController.createEvent);

export default router;
