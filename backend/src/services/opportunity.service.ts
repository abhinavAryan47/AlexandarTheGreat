import { Opportunity } from '../models/opportunity.model';
import { CreateOpportunityInput, UpdateOpportunityInput } from '../schemas/opportunity.schema';
import { OpportunityRepository, opportunityRepository } from '../repositories/opportunity.repository';

export class OpportunityService {
  constructor(private repo: OpportunityRepository = opportunityRepository) {}

  async getAllOpportunities(): Promise<Opportunity[]> {
    return this.repo.getAll();
  }

  async getOpportunityById(id: string): Promise<Opportunity | null> {
    return this.repo.getById(id);
  }

  async createOpportunity(input: CreateOpportunityInput): Promise<Opportunity> {
    return this.repo.create(input);
  }

  async updateOpportunity(id: string, input: UpdateOpportunityInput): Promise<Opportunity | null> {
    return this.repo.update(id, input);
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }

  async getOpportunitiesByNoticeId(noticeId: string): Promise<Opportunity[]> {
    return this.repo.findByNoticeId(noticeId);
  }
}

export const opportunityService = new OpportunityService();
