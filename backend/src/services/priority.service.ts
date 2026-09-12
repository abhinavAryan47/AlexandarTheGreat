import { TaskPriority } from '../models/task.model';
import { Student } from '../models/student.model';
import { RelevanceScoreResult } from './relevance.service';

export interface EvaluationResult {
  eligible: boolean;
  relevanceScore: number;
  priority: TaskPriority;
  reason: string;
}

export class PriorityService {
  /**
   * Maps a numerical relevance score to a standardized priority level.
   */
  mapScoreToPriority(score: number): TaskPriority {
    if (score >= 90) return 'critical';
    if (score >= 75) return 'high';
    if (score >= 50) return 'medium';
    return 'low';
  }

  /**
   * Generates a deterministic human-friendly evaluation reason.
   */
  generateReason(student: Student, relevance: RelevanceScoreResult, title?: string): string {
    const priority = this.mapScoreToPriority(relevance.relevanceScore);
    const targetTitle = title ? `for "${title}"` : '';

    if (!relevance.eligible) {
      return `You are currently not eligible ${targetTitle}. Reason: ${relevance.reasons.join(' ')}`;
    }

    let interestSnippet = '';
    if (student.academicInterests.length > 0) {
      interestSnippet = ` and aligns with your interest in ${student.academicInterests.slice(0, 2).join(', ')}`;
    }

    return `You are a Year ${student.year} ${student.branch} student with a CGPA of ${student.cgpa}. You meet all stated eligibility criteria${interestSnippet}. Recommended Priority: ${priority.toUpperCase()} (${relevance.relevanceScore}/100 relevance score).`;
  }
}

export const priorityService = new PriorityService();
