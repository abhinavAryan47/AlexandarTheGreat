import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import path from 'path';
import fs from 'fs/promises';
import { app } from '../src/app';
import { seedDatabase } from '../src/scripts/seed';

const TEST_DATA_DIR = path.resolve(__dirname, '../data_test');

describe('AlexandarTheGreat Backend API (Phase 1)', () => {
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
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.updatedAt).toBeDefined();
      createdStudentId = res.body.data.id;
    });

    it('should update an existing student profile', async () => {
      const updatePayload = {
        cgpa: 9.05,
        placementPreferences: ['Security Engineer', 'Cloud Architect', 'Site Reliability Engineer']
      };

      const res = await request(app)
        .patch(`/api/students/${createdStudentId}`)
        .send(updatePayload);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cgpa).toBe(9.05);
      expect(res.body.data.placementPreferences.length).toBe(3);
    });

    it('should reject invalid student creation (Zod 400)', async () => {
      const invalidPayload = {
        name: '', // Empty name
        email: 'invalid-email-format',
        year: 6, // Exceeds max 5
        cgpa: 11.5 // Exceeds max 10.0
      };

      const res = await request(app).post('/api/students').send(invalidPayload);
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(Array.isArray(res.body.error.details)).toBe(true);
      expect(res.body.error.details.length).toBeGreaterThanOrEqual(3);
    });

    it('should return 404 for non-existent student ID', async () => {
      const res = await request(app).get('/api/students/non-existent-student-999');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('STUDENT_NOT_FOUND');
    });

    it('should delete a student by ID', async () => {
      const res = await request(app).delete(`/api/students/${createdStudentId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const checkRes = await request(app).get(`/api/students/${createdStudentId}`);
      expect(checkRes.status).toBe(404);
    });
  });

  // 3. Notice Endpoints
  describe('Notices API (/api/notices)', () => {
    let createdNoticeId = '';

    it('should retrieve all notices', async () => {
      const res = await request(app).get('/api/notices');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });

    it('should create a new raw notice', async () => {
      const payload = {
        title: 'Google Summer of Code 2027 Mentorship Program',
        content: 'Campus Open Source Club will host an info session on GSoC proposal writing and organization selection on 14th October 2026.',
        source: 'Open Source Club',
        category: 'club'
      };

      const res = await request(app).post('/api/notices').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      createdNoticeId = res.body.data.id;
    });

    it('should retrieve notice by ID', async () => {
      const res = await request(app).get(`/api/notices/${createdNoticeId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdNoticeId);
    });

    it('should update notice', async () => {
      const res = await request(app)
        .patch(`/api/notices/${createdNoticeId}`)
        .send({ category: 'event' });
      expect(res.status).toBe(200);
      expect(res.body.data.category).toBe('event');
    });

    it('should delete notice', async () => {
      const res = await request(app).delete(`/api/notices/${createdNoticeId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 4. Opportunity Endpoints
  describe('Opportunities API (/api/opportunities)', () => {
    let createdOppId = '';

    it('should retrieve all opportunities', async () => {
      const res = await request(app).get('/api/opportunities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(5);
    });

    it('should create a new opportunity', async () => {
      const payload = {
        noticeId: 'notif-201-placement-msft',
        title: 'Microsoft Support Engineering Internship',
        category: 'placement',
        description: '6-month internship track for 3rd and 4th-year students.',
        deadline: '2026-09-21T23:59:59.000Z'
      };

      const res = await request(app).post('/api/opportunities').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(payload.title);
      createdOppId = res.body.data.id;
    });

    it('should retrieve opportunity by ID', async () => {
      const res = await request(app).get(`/api/opportunities/${createdOppId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(createdOppId);
    });

    it('should return 400 when creating opportunity without required noticeId', async () => {
      const res = await request(app).post('/api/opportunities').send({
        title: 'Incomplete Opportunity',
        category: 'event'
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // 5. Task Endpoints
  describe('Tasks API (/api/tasks)', () => {
    let createdTaskId = '';

    it('should retrieve all tasks', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(8);
    });

    it('should create a new task associated with a student', async () => {
      const payload = {
        studentId: 'stud-101-aarav-cse',
        title: 'Review System Design Primer chapter on Caching',
        description: 'Prepare Redis vs Memcached notes for upcoming tech interviews.',
        deadline: '2026-09-26T18:00:00.000Z',
        status: 'pending',
        priority: 'medium',
        sourceNoticeId: 'notif-201-placement-msft'
      };

      const res = await request(app).post('/api/tasks').send(payload);
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.studentId).toBe(payload.studentId);
      expect(res.body.data.status).toBe('pending');
      createdTaskId = res.body.data.id;
    });

    it('should retrieve tasks for a particular student', async () => {
      const res = await request(app).get('/api/tasks/student/stud-101-aarav-cse');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(3);
      for (const t of res.body.data) {
        expect(t.studentId).toBe('stud-101-aarav-cse');
      }
    });

    it('should update task status to completed', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${createdTaskId}`)
        .send({ status: 'completed' });
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('completed');
    });

    it('should delete a task', async () => {
      const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // 6. Dashboard Consolidated API
  describe('Dashboard API (/api/dashboard/:studentId)', () => {
    it('should return aggregated campus dashboard for a valid student', async () => {
      const res = await request(app).get('/api/dashboard/stud-101-aarav-cse');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const data = res.body.data;
      expect(data.student).toBeDefined();
      expect(data.student.id).toBe('stud-101-aarav-cse');
      expect(data.student.name).toBe('Aarav Sharma');

      expect(Array.isArray(data.upcomingTasks)).toBe(true);
      expect(data.upcomingTasks.length).toBeGreaterThanOrEqual(1);

      expect(Array.isArray(data.opportunities)).toBe(true);
      expect(data.opportunities.length).toBeGreaterThanOrEqual(1);

      expect(Array.isArray(data.recentNotices)).toBe(true);
      expect(data.recentNotices.length).toBeGreaterThanOrEqual(1);
    });

    it('should return 404 for non-existent student dashboard query', async () => {
      const res = await request(app).get('/api/dashboard/unknown-student-id');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('STUDENT_NOT_FOUND');
    });
  });

  // 7. General Error Handling (404 and Malformed JSON)
  describe('General Error Handling', () => {
    it('should return 404 for unknown route', async () => {
      const res = await request(app).get('/api/some-unknown-path');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});
