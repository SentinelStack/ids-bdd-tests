import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const ForensicPacketDataSchema = z
  .object({
    deviceId: z.string(),
    alertId: z.string().nullable(),
    timestamp: z.string(),
    protocol: z.string(),
    sourceIp: z.string(),
    destinationIp: z.string(),
    sourcePort: z.number(),
    destinationPort: z.number(),
    packetSize: z.number(),
    tcpFlags: z.string().nullable(),
  })
  .partial()
  .passthrough();

export const ForensicsResponseSchema = apiEnvelope(ForensicPacketDataSchema);
export type ApiForensicsResponse = z.infer<typeof ForensicsResponseSchema>;

export const ForensicPacketPageDataSchema = z
  .object({ content: z.array(ForensicPacketDataSchema), totalElements: z.number(), size: z.number() })
  .partial()
  .passthrough();
export const ForensicsListResponseSchema = apiEnvelope(ForensicPacketPageDataSchema);
export type ApiForensicsListResponse = z.infer<typeof ForensicsListResponseSchema>;
