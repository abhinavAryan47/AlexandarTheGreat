import { z } from 'zod';

export const createOpportunitySchema = z.object({
  noticeId: z.string().trim().min(1, 'noticeId is required'),
  title: z.string().trim().min(1, 'Title is required'),
  category: z.string().trim().min(1, 'Category is required'),
  description: z.string().trim().optional(),
  deadline: z.string().trim().optional()
});

export const updateOpportunitySchema = createOpportunitySchema.partial();

export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;
export type UpdateOpportunityInput = z.infer<typeof updateOpportunitySchema>;
