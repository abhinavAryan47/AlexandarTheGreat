import { Student } from '../models/student.model';
import { EligibilityService, eligibilityService, EligibilityCriteria } from './eligibility.service';

export interface OpportunityContext {
  title: string;
  category?: string;
  description?: string;
  deadline?: string | null;
  eligibility?: EligibilityCriteria;
}

export interface RelevanceScoreResult {
  eligible: boolean;
  relevanceScore: number;
  breakdown: {
    eligibilityScore: number;
    academicMatchScore: number;
    interestMatchScore: number;
    urgencyScore: number;
  };
  reasons: string[];
}

export class RelevanceService {
  constructor(private eligibility: EligibilityService = eligibilityService) {}

  calculate(student: Student, context: OpportunityContext): RelevanceScoreResult {
    // 1. Eligibility Score (50 pts)
    const eligResult = this.eligibility.evaluate(student, context.eligibility || {});
    const eligibilityScore = eligResult.eligible ? 50 : 0;

    // Combine textual content for keyword matching
    const corpus = `${context.title} ${context.description || ''} ${context.category || ''}`.toLowerCase();

    // 2. Academic & Placement Preferences Match (20 pts)
    let academicMatches = 0;
    const allAcademicKeywords = [
      ...student.academicInterests,
      ...student.placementPreferences
    ];

    for (const kw of allAcademicKeywords) {
      const words = kw.toLowerCase().split(/\s+/);
      if (words.some((w) => w.length > 2 && corpus.includes(w))) {
        academicMatches++;
      }
    }
    const academicMatchScore = Math.min(20, Math.round((academicMatches / Math.max(1, allAcademicKeywords.length)) * 40));

    // 3. Extracurricular Interests & Category Match (20 pts)
    let interestMatches = 0;
    for (const interest of student.extracurricularInterests) {
      const words = interest.toLowerCase().split(/\s+/);
      if (words.some((w) => w.length > 2 && corpus.includes(w))) {
        interestMatches++;
      }
    }
    // Category boost
    if (context.category && ['placement', 'event', 'club', 'scholarship'].includes(context.category)) {
      interestMatches += 1;
    }
    const interestMatchScore = Math.min(20, Math.max(8, interestMatches * 6));

    // 4. Urgency Score (10 pts)
    let urgencyScore = 4;
    if (context.deadline) {
      const deadlineDate = new Date(context.deadline);
      const now = new Date();
      const diffDays = (deadlineDate.getTime() - now.getTime()) / (1000 * 3600 * 24);

      if (diffDays >= 0 && diffDays <= 7) {
        urgencyScore = 10;
      } else if (diffDays > 7 && diffDays <= 14) {
        urgencyScore = 8;
      } else if (diffDays > 14 && diffDays <= 30) {
        urgencyScore = 6;
      }
    }

    const totalScore = Math.min(100, Math.max(0, eligibilityScore + academicMatchScore + interestMatchScore + urgencyScore));

    return {
      eligible: eligResult.eligible,
      relevanceScore: totalScore,
      breakdown: {
        eligibilityScore,
        academicMatchScore,
        interestMatchScore,
        urgencyScore
      },
      reasons: eligResult.reasons
    };
  }
}

export const relevanceService = new RelevanceService();
