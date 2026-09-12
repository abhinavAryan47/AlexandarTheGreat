import { Request, Response, NextFunction } from 'express';
import { CalendarService, calendarService } from '../integrations/calendar.service';
import { ApiResponse } from '../utils/api-response';

export class CalendarController {
  constructor(private service: CalendarService = calendarService) {}

  createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { taskId } = req.body;
      if (!taskId) {
        ApiResponse.error(res, 'VALIDATION_ERROR', 'taskId is required in request body', 400);
        return;
      }

      const result = await this.service.createEventForTask(taskId);
      ApiResponse.success(res, result);
    } catch (error: any) {
      if (error.message && error.message.includes('not found')) {
        ApiResponse.error(res, 'TASK_NOT_FOUND', error.message, 404);
        return;
      }
      next(error);
    }
  };
}

export const calendarController = new CalendarController();
