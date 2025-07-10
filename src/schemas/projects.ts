import { z } from 'zod';

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  technologies: z.array(z.string()).default([]),
  url: z.string().optional()
});

export type Project = z.infer<typeof projectSchema>;