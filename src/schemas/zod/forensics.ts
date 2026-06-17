import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

/** Metadatele unui pachet capturat (fără payload PCAP), așa cum le întoarce backendul. */
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

/** Răspunsul pentru ingest (POST /api/forensics/packets): un singur pachet în data. */
export const ForensicsResponseSchema = apiEnvelope(ForensicPacketDataSchema);
export type ApiForensicsResponse = z.infer<typeof ForensicsResponseSchema>;

/** Răspunsul pentru listare (GET /api/forensics): o colecție de pachete în data. */
export const ForensicsListResponseSchema = apiEnvelope(z.array(ForensicPacketDataSchema));
export type ApiForensicsListResponse = z.infer<typeof ForensicsListResponseSchema>;
