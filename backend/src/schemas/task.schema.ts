import { z } from 'zod';

export const createTaskSchema = z.object({
  studentId: z.string().trim().min(1, 'studentId is required'),
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().optional(),
  deadline: z.string().trim().optional(),
  status: z.enum(['pending', 'completed']).default('pending'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  sourceNoticeId: z.string().trim().optional()
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
