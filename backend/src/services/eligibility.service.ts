import { Student } from '../models/student.model';

export interface EligibilityCriteria {
  branches?: string[];
  years?: number[];
  minCGPA?: number | null;
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export class EligibilityService {
  /**
   * Deterministically evaluates whether a student meets the criteria for an opportunity/notice.
   */
  evaluate(student: Student, criteria: EligibilityCriteria): EligibilityResult {
    const reasons: string[] = [];
    let eligible = true;

    // 1. Check Year Eligibility
    if (criteria.years && criteria.years.length > 0) {
      if (!criteria.years.includes(student.year)) {
        eligible = false;
        reasons.push(
          `Eligible for year(s) ${criteria.years.join(', ')}, but student is in year ${student.year}.`
        );
      } else {
        reasons.push(`Student meets year requirement (Year ${student.year}).`);
      }
    }

    // 2. Check CGPA Cutoff
    if (criteria.minCGPA !== undefined && criteria.minCGPA !== null) {
      if (student.cgpa < criteria.minCGPA) {
        eligible = false;
        reasons.push(
          `Minimum CGPA cutoff is ${criteria.minCGPA}, but student CGPA is ${student.cgpa}.`
        );
      } else {
        reasons.push(`Student CGPA (${student.cgpa}) meets cutoff of ${criteria.minCGPA}.`);
      }
    }

    // 3. Check Branch Eligibility
    if (criteria.branches && criteria.branches.length > 0) {
      const studentBranchNorm = student.branch.toLowerCase();
      const isBranchMatch = criteria.branches.some((b) => {
        const bNorm = b.toLowerCase().trim();
        return (
          studentBranchNorm.includes(bNorm) ||
          bNorm.includes(studentBranchNorm) ||
          this.matchAcronym(student.branch, b)
        );
      });

      if (!isBranchMatch) {
        eligible = false;
        reasons.push(
          `Eligible branches: ${criteria.branches.join(', ')}. Student branch is ${student.branch}.`
        );
      } else {
        reasons.push(`Student branch (${student.branch}) is eligible.`);
      }
    }

    if (eligible && reasons.length === 0) {
      reasons.push('Open to all students with no restrictive eligibility constraints.');
    }

    return {
      eligible,
      reasons
    };
  }

  private matchAcronym(fullName: string, code: string): boolean {
    const acronyms: Record<string, string[]> = {
      cse: ['computer science', 'cse', 'computer science and engineering', 'information technology'],
      it: ['information technology', 'it', 'computer science'],
      ece: ['electronics', 'electronics and communication engineering', 'ece'],
      me: ['mechanical', 'mechanical engineering', 'me'],
      ce: ['civil', 'civil engineering', 'ce'],
      ee: ['electrical', 'electrical engineering', 'ee']
    };

    const target = code.toLowerCase().trim();
    const mapped = acronyms[target];
    if (mapped) {
      return mapped.some((m) => fullName.toLowerCase().includes(m));
    }
    return false;
  }
}

export const eligibilityService = new EligibilityService();
