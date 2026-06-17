import { z } from 'zod';

export const apiEnvelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ success: z.boolean().optional(), message: z.string().optional(), data: data.optional() }).passthrough();
