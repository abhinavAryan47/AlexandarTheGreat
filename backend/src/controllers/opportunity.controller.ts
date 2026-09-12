import { Request, Response, NextFunction } from 'express';
import { OpportunityService, opportunityService } from '../services/opportunity.service';
import { ApiResponse } from '../utils/api-response';

export class OpportunityController {
  constructor(private service: OpportunityService = opportunityService) {}

  getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opportunities = await this.service.getAllOpportunities();
      ApiResponse.success(res, opportunities);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opportunity = await this.service.getOpportunityById(req.params.id);
      if (!opportunity) {
        ApiResponse.error(res, 'OPPORTUNITY_NOT_FOUND', `Opportunity with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, opportunity);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opportunity = await this.service.createOpportunity(req.body);
      ApiResponse.success(res, opportunity, 201);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opportunity = await this.service.updateOpportunity(req.params.id, req.body);
      if (!opportunity) {
        ApiResponse.error(res, 'OPPORTUNITY_NOT_FOUND', `Opportunity with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, opportunity);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleted = await this.service.deleteOpportunity(req.params.id);
      if (!deleted) {
        ApiResponse.error(res, 'OPPORTUNITY_NOT_FOUND', `Opportunity with id ${req.params.id} not found`, 404);
        return;
      }
      ApiResponse.success(res, { message: `Opportunity ${req.params.id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  };
}

export const opportunityController = new OpportunityController();
