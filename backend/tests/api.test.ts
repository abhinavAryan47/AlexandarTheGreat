import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';
import { app } from '../src/app';
import { seedDatabase } from '../src/scripts/seed';
import { eligibilityService } from '../src/services/eligibility.service';
import { relevanceService } from '../src/services/relevance.service';
import { priorityService } from '../src/services/priority.service';
import { Student } from '../src/models/student.model';

const TEST_DATA_DIR = path.resolve(__dirname, '../data_test');

describe('AlexandarTheGreat Backend API (Phase 1-5 End-to-End)', () => {
  beforeAll(async () => {
    process.env.DATA_DIR = TEST_DATA_DIR;
    await seedDatabase(TEST_DATA_DIR);
  });

  afterAll(async () => {
    try {
      await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
    } catch {
      // Ignore cleanup error
    }
  });

  // 1. Health Check
  describe('GET /health', () => {
    it('should return health status 200 ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        data: {
          status: 'ok',
          service: 'AlexandarTheGreat Backend'
        }
      });
    });
  });

  // 2. Student Endpoints
  describe('Students API (/api/students)', () => {
    let createdStudentId = '';

    it('should retrieve all students', async () => {
      const res = await request(app).get('/api/students');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    });

    it('should retrieve a specific student by ID', async () => {
      const res = await request(app).get('/api/students/stud-101-aarav-cse');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Aarav Sharma');
      expect(res.body.data.branch).toBe('Computer Science and Engineering');
    });

    it('should create a new student with valid data', async () => {
      const payload = {
        name: 'Sneha Rao',
        email: 'sneha.rao@campus.edu.in',
        year: 3,
        branch: 'Information Technology',
        cgpa: 8.92,
        academicInterests: ['Cybersecurity', 'Cloud Architectures'],
        placementPreferences: ['Security Engineer', 'DevOps Specialist'],
        extracurricularInterests: ['CTF Team', 'Badminton']
      };

      const res = await request(app).post('/api/students').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.name).toBe(payload.name);
      createdStudentId = res.body.data.id;
    });

    it('should update an existing student profile', async () => {
      const res = await request(app)
        .patch(`/api/students/${createdStudentId}`)
        .send({ cgpa: 9.05 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cgpa).toBe(9.05);
    });

    it('should reject invalid student creation (Zod 400)', async () => {
      const res = await request(app).post('/api/students').send({
        name: '',
        email: 'invalid-email',
        year: 9,
        cgpa: 15
      });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should delete a student by ID', async () => {
      const res = await request(app).delete(`/api/students/${createdStudentId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 3. Deterministic Eligibility & Relevance Engine (Phase 3)
  describe('Phase 3: Eligibility, Relevance & Priority Services', () => {
    const studentAarav: Student = {
      id: 'stud-101-aarav-cse',
      name: 'Aarav Sharma',
      email: 'aarav.sharma@campus.edu.in',
      year: 4,
      branch: 'Computer Science and Engineering',
      cgpa: 8.85,
      academicInterests: ['Artificial Intelligence', 'Distributed Systems'],
      placementPreferences: ['Software Development Engineer'],
      extracurricularInterests: ['Competitive Coding', 'Hackathons'],
      createdAt: '2026-08-01T09:00:00.000Z',
      updatedAt: '2026-09-01T10:00:00.000Z'
    };

    it('should evaluate eligible for matching year, branch, and CGPA', () => {
      const criteria = {
        branches: ['CSE', 'IT', 'ECE'],
        years: [4],
        minCGPA: 8.0
      };
      const result = eligibilityService.evaluate(studentAarav, criteria);
      expect(result.eligible).toBe(true);
    });

    it('should evaluate ineligible for non-matching year or high CGPA cutoff', () => {
      const criteria = {
        branches: ['CSE'],
        years: [2],
        minCGPA: 9.5
      };
      const result = eligibilityService.evaluate(studentAarav, criteria);
      expect(result.eligible).toBe(false);
      expect(result.reasons.length).toBeGreaterThanOrEqual(2);
    });

    it('should compute high relevance score and critical priority for matching placement', () => {
      const rel = relevanceService.calculate(studentAarav, {
        title: 'Microsoft SDE Campus Recruitment Drive',
        category: 'placement',
        description: 'Full-time Software Development Engineer role in Artificial Intelligence and Cloud.',
        deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
        eligibility: {
          branches: ['CSE', 'IT'],
          years: [4],
          minCGPA: 8.0
        }
      });

      expect(rel.eligible).toBe(true);
      expect(rel.relevanceScore).toBeGreaterThanOrEqual(75);
      const priority = priorityService.mapScoreToPriority(rel.relevanceScore);
      expect(['high', 'critical']).toContain(priority);

      const reason = priorityService.generateReason(studentAarav, rel, 'Microsoft SDE');
      expect(reason).toContain('Year 4');
      expect(reason).toContain('Computer Science and Engineering');
    });
  });

  // 4. Opportunity Evaluation Endpoint
  describe('Opportunity Evaluation Endpoint', () => {
    it('should evaluate student against an opportunity', async () => {
      const res = await request(app).get(
        '/api/opportunities/opp-301-msft-sde/evaluate/stud-102-priya-ece'
      );
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.opportunity.id).toBe('opp-301-msft-sde');
      expect(res.body.data.evaluation.eligible).toBe(true);
      expect(res.body.data.evaluation.relevanceScore).toBeGreaterThan(50);
      expect(res.body.data.evaluation.priority).toBeDefined();
    });
  });

  // 5. Tasks & Actionable Tasks from Notice (Phase 4)
  describe('Tasks API & Actionable Generation', () => {
    it('should generate actionable tasks from an existing notice', async () => {
      const res = await request(app).post('/api/tasks/from-notice').send({
        noticeId: 'notif-201-placement-msft',
        studentId: 'stud-102-priya-ece'
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.tasks)).toBe(true);
      expect(res.body.data.count).toBeGreaterThanOrEqual(1);

      const created = res.body.data.tasks[0];
      expect(created.studentId).toBe('stud-102-priya-ece');
      expect(created.sourceNoticeId).toBe('notif-201-placement-msft');
    });

    it('should retrieve tasks for student including newly generated tasks', async () => {
      const res = await request(app).get('/api/tasks/student/stud-102-priya-ece');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
    });
  });

  // 6. Google Calendar Safe Handling (Phase 4B)
  describe('Calendar API (/api/calendar/create)', () => {
    it('should safely return unconfigured status without throwing errors if credentials missing', async () => {
      const res = await request(app).post('/api/calendar/create').send({
        taskId: 'task-401-priya-msft-resume'
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('unconfigured');
      expect(res.body.data.configured).toBe(false);
      expect(res.body.data.task.id).toBe('task-401-priya-msft-resume');
    });
  });

  // 7. Dashboard API Consolidated View
  describe('Dashboard API (/api/dashboard/:studentId)', () => {
    it('should return aggregated campus dashboard for student', async () => {
      const res = await request(app).get('/api/dashboard/stud-101-aarav-cse');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.student.id).toBe('stud-101-aarav-cse');
      expect(res.body.data.upcomingTasks.length).toBeGreaterThan(0);
      expect(res.body.data.opportunities.length).toBeGreaterThan(0);
      expect(res.body.data.recentNotices.length).toBeGreaterThan(0);
    });
  });
});
