import { z } from 'zod';

/** Plicul standard al backendului: { success, message, data }. */
export const apiEnvelope = <T extends z.ZodTypeAny>(data: T) =>
  z.object({ success: z.boolean().optional(), message: z.string().optional(), data: data.optional() }).passthrough();
