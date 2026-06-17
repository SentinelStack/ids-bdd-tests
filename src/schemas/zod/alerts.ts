import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const AlertDataSchema = z
  .object({
    alertId: z.string(),
    type: z.string(),
    severity: z.string(),
    protocol: z.string(),
    sourceIp: z.string(),
    destinationIp: z.string(),
    status: z.string(),
    acknowledged: z.boolean(),
  })
  .partial()
  .passthrough();
export const AlertResponseSchema = apiEnvelope(AlertDataSchema);
export type ApiAlertResponse = z.infer<typeof AlertResponseSchema>;

export const AlertPageDataSchema = z
  .object({ content: z.array(AlertDataSchema), totalElements: z.number(), size: z.number() })
  .partial()
  .passthrough();
export const AlertListResponseSchema = apiEnvelope(AlertPageDataSchema);
export type ApiAlertListResponse = z.infer<typeof AlertListResponseSchema>;
