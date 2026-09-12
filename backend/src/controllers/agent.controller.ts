import { Request, Response, NextFunction } from 'express';
import { CampusAgentService, campusAgentService } from '../ai/campus-agent.service';
import { ApiResponse } from '../utils/api-response';

export class AgentController {
  constructor(private agentService: CampusAgentService = campusAgentService) {}

  chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { studentId, message } = req.body;
      if (!studentId || !message) {
        ApiResponse.error(res, 'VALIDATION_ERROR', 'studentId and message are required in request body', 400);
        return;
      }

      const result = await this.agentService.chat(studentId, message);
      ApiResponse.success(res, result);
    } catch (error: any) {
      if (error.message && error.message.includes('NVIDIA NIM')) {
        ApiResponse.error(res, 'NIM_API_ERROR', error.message, 503);
        return;
      }
      next(error);
    }
  };
}

export const agentController = new AgentController();
