import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  content: z.string().trim().min(1, 'Content is required'),
  source: z.string().trim().optional(),
  category: z.string().trim().optional()
});

export const updateNoticeSchema = createNoticeSchema.partial();

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>;
