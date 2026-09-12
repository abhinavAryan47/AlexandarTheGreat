import { z } from 'zod';

export const noticeAnalysisOutputSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.enum([
    'placement',
    'scholarship',
    'examination',
    'academic',
    'event',
    'club',
    'administrative',
    'other'
  ]),
  summary: z.string().min(1, 'Summary is required'),
  deadline: z.string().nullable().default(null),
  eligibility: z.object({
    branches: z.array(z.string()).default([]),
    years: z.array(z.number()).default([]),
    minCGPA: z.number().nullable().default(null)
  }).default({
    branches: [],
    years: [],
    minCGPA: null
  }),
  actions: z.array(z.string()).default([]),
  targetGroups: z.array(z.string()).default([])
});

export type NoticeAnalysisOutput = z.infer<typeof noticeAnalysisOutputSchema>;

export const noticeAnalysisRequestSchema = z.object({
  content: z.string().trim().min(5, 'Notice content must be at least 5 characters'),
  studentId: z.string().trim().optional()
});

export type NoticeAnalysisRequest = z.infer<typeof noticeAnalysisRequestSchema>;
