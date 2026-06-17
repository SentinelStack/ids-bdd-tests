import { z } from 'zod';
export const DeviceSchema = z.object({
  deviceId: z.string(),
  name: z.string(),
  status: z.enum(['ONLINE', 'OFFLINE', 'QUARANTINED', 'UNKNOWN']).optional(),
});
export type Device = z.infer<typeof DeviceSchema>;
