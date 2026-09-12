import { Request, Response, NextFunction } from 'express';
import { DashboardService, dashboardService } from '../services/dashboard.service';
import { ApiResponse } from '../utils/api-response';

export class DashboardController {
  constructor(private service: DashboardService = dashboardService) {}

  getStudentDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { studentId } = req.params;
      const data = await this.service.getStudentDashboard(studentId);

      if (!data) {
        ApiResponse.error(
          res,
          'STUDENT_NOT_FOUND',
          `Student with id ${studentId} not found for dashboard`,
          404
        );
        return;
      }

      ApiResponse.success(res, data);
    } catch (error) {
      next(error);
    }
  };
}

export const dashboardController = new DashboardController();
