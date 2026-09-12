import { Opportunity } from '../models/opportunity.model';
import { CreateOpportunityInput, UpdateOpportunityInput } from '../schemas/opportunity.schema';
import { OpportunityRepository, opportunityRepository } from '../repositories/opportunity.repository';
import { StudentRepository, studentRepository } from '../repositories/student.repository';
import { NoticeRepository, noticeRepository } from '../repositories/notice.repository';
import { relevanceService, RelevanceService } from './relevance.service';
import { priorityService, PriorityService, EvaluationResult } from './priority.service';

export class OpportunityService {
  constructor(
    private repo: OpportunityRepository = opportunityRepository,
    private studentRepo: StudentRepository = studentRepository,
    private noticeRepo: NoticeRepository = noticeRepository,
    private relevance: RelevanceService = relevanceService,
    private priority: PriorityService = priorityService
  ) {}

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

  async evaluateForStudent(opportunityId: string, studentId: string): Promise<{
    opportunity: Opportunity;
    evaluation: EvaluationResult;
  } | null> {
    const opportunity = await this.repo.getById(opportunityId);
    if (!opportunity) return null;

    const student = await this.studentRepo.getById(studentId);
    if (!student) return null;

    // Read source notice for full content context if available
    let noticeContent = '';
    if (opportunity.noticeId) {
      const notice = await this.noticeRepo.getById(opportunity.noticeId);
      if (notice) {
        noticeContent = notice.content;
      }
    }

    const relResult = this.relevance.calculate(student, {
      title: opportunity.title,
      category: opportunity.category,
      description: `${opportunity.description || ''} ${noticeContent}`,
      deadline: opportunity.deadline
    });

    const priority = this.priority.mapScoreToPriority(relResult.relevanceScore);
    const reason = this.priority.generateReason(student, relResult, opportunity.title);

    return {
      opportunity,
      evaluation: {
        eligible: relResult.eligible,
        relevanceScore: relResult.relevanceScore,
        priority,
        reason
      }
    };
  }
}

export const opportunityService = new OpportunityService();
