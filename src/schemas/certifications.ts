import { z } from 'zod';

export const certificationSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  credentialId: z.string().optional()
});

export type Certification = z.infer<typeof certificationSchema>;