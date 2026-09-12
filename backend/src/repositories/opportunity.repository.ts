import { JsonRepository } from './json.repository';
import { Opportunity } from '../models/opportunity.model';

export class OpportunityRepository extends JsonRepository<Opportunity> {
  constructor(customDir?: string) {
    super('opportunities.json', customDir);
  }

  async findByNoticeId(noticeId: string): Promise<Opportunity[]> {
    return this.find((o) => o.noticeId === noticeId);
  }
}

export const opportunityRepository = new OpportunityRepository();
