import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const ForensicPacketDataSchema = z
  .object({
    packetId: z.string(),
    deviceId: z.string(),
    protocol: z.string(),
    sourceIp: z.string(),
    destinationIp: z.string(),
    capturedAt: z.string(),
  })
  .partial()
  .passthrough();

export const ForensicsResponseSchema = apiEnvelope(ForensicPacketDataSchema);
export type ApiForensicsResponse = z.infer<typeof ForensicsResponseSchema>;

export const ForensicsListResponseSchema = apiEnvelope(z.array(ForensicPacketDataSchema));
export type ApiForensicsListResponse = z.infer<typeof ForensicsListResponseSchema>;
