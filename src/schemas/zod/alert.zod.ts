import { z } from 'zod';
export const AlertSchema = z.object({
  alertId: z.string(),
  type: z.string(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  protocol: z.string(),
  sourceIp: z.string().optional(),
  timestamp: z.string(),
});
export type Alert = z.infer<typeof AlertSchema>;
