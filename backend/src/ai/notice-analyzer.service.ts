import { nimClient, NimClient } from './nim.client';
import { NOTICE_ANALYSIS_SYSTEM_PROMPT } from './prompts/notice-analysis.prompt';
import { noticeAnalysisOutputSchema, NoticeAnalysisOutput } from './schemas/ai-output.schema';
import { NoticeRepository, noticeRepository } from '../repositories/notice.repository';
import { OpportunityRepository, opportunityRepository } from '../repositories/opportunity.repository';
import { StudentRepository, studentRepository } from '../repositories/student.repository';
import { relevanceService, RelevanceService } from '../services/relevance.service';
import { priorityService, PriorityService, EvaluationResult } from '../services/priority.service';
import { Notice } from '../models/notice.model';
import { Opportunity } from '../models/opportunity.model';

export interface NoticeAnalysisResult {
  notice: Notice;
  opportunity: Opportunity;
  extracted: NoticeAnalysisOutput;
  evaluation?: EvaluationResult;
}

export class NoticeAnalyzerService {
  constructor(
    private nim: NimClient = nimClient,
    private noticeRepo: NoticeRepository = noticeRepository,
    private oppRepo: OpportunityRepository = opportunityRepository,
    private studentRepo: StudentRepository = studentRepository,
    private relevance: RelevanceService = relevanceService,
    private priority: PriorityService = priorityService
  ) {}

  async analyzeNotice(content: string, studentId?: string): Promise<NoticeAnalysisResult> {
    if (!this.nim.isConfigured()) {
      throw new Error('NVIDIA NIM API key is not configured in backend/.env.');
    }

    // Call NVIDIA NIM
    const model = await this.nim.getActiveModel();
    const completion = await this.nim.completeChat(
      [
        { role: 'system', content: NOTICE_ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: `Analyze this college notice text:\n\n${content}` }
      ],
      {
        model,
        temperature: 0.1,
        response_format: { type: 'json_object' }
      }
    );

    const rawResponse = completion.choices[0]?.message?.content || '';
    const parsed = this.safeParseJson(rawResponse);
    const validated = noticeAnalysisOutputSchema.parse(parsed);

    // Persist Notice
    const savedNotice = await this.noticeRepo.create({
      title: validated.title,
      content,
      category: validated.category,
      source: validated.targetGroups.length > 0 ? validated.targetGroups.join(', ') : 'Campus Administration'
    });

    // Auto-create Opportunity
    const savedOpportunity = await this.oppRepo.create({
      noticeId: savedNotice.id,
      title: validated.title,
      category: validated.category,
      description: validated.summary,
      deadline: validated.deadline || undefined
    });

    // If studentId provided, perform deterministic eligibility & relevance evaluation
    let evaluation: EvaluationResult | undefined;
    if (studentId) {
      const student = await this.studentRepo.getById(studentId);
      if (student) {
        const relScore = this.relevance.calculate(student, {
          title: validated.title,
          category: validated.category,
          description: validated.summary,
          deadline: validated.deadline,
          eligibility: validated.eligibility
        });

        const priorityLevel = this.priority.mapScoreToPriority(relScore.relevanceScore);
        const reason = this.priority.generateReason(student, relScore, validated.title);

        evaluation = {
          eligible: relScore.eligible,
          relevanceScore: relScore.relevanceScore,
          priority: priorityLevel,
          reason
        };
      }
    }

    return {
      notice: savedNotice,
      opportunity: savedOpportunity,
      extracted: validated,
      evaluation
    };
  }

  private safeParseJson(raw: string): unknown {
    try {
      return JSON.parse(raw);
    } catch {
      // Strip markdown code fences if model returned ```json ... ```
      const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      try {
        return JSON.parse(cleaned);
      } catch {
        // Find first { and last }
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}');
        if (start !== -1 && end !== -1 && end > start) {
          return JSON.parse(raw.slice(start, end + 1));
        }
        throw new Error(`Failed to parse valid JSON from model response: ${raw.slice(0, 200)}`);
      }
    }
  }
}

export const noticeAnalyzerService = new NoticeAnalyzerService();
