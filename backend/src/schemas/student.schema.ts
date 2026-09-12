import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Invalid email address'),
  year: z.number().int().min(1, 'Year must be at least 1').max(5, 'Year must be at most 5'),
  branch: z.string().trim().min(1, 'Branch is required'),
  cgpa: z.number().min(0, 'CGPA must be at least 0.0').max(10, 'CGPA cannot exceed 10.0'),
  academicInterests: z.array(z.string().trim()).default([]),
  placementPreferences: z.array(z.string().trim()).default([]),
  extracurricularInterests: z.array(z.string().trim()).default([])
});

export const updateStudentSchema = createStudentSchema.partial();

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
