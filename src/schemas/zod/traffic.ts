import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const TrafficStatsDataSchema = z
  .object({
    id: z.unknown(),
    totalPackets: z.number(),
    totalBytes: z.number(),
    windowSeconds: z.number(),
    timestamp: z.string(),
  })
  .partial()
  .passthrough();
export const TrafficStatsResponseSchema = apiEnvelope(TrafficStatsDataSchema);
export type ApiTrafficStatsResponse = z.infer<typeof TrafficStatsResponseSchema>;

export const TrafficOverviewResponseSchema = apiEnvelope(z.unknown());
export type ApiTrafficOverviewResponse = z.infer<typeof TrafficOverviewResponseSchema>;
