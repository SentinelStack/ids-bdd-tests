import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const DeviceDataSchema = z
  .object({ deviceId: z.string(), name: z.string(), ipAddress: z.string(), status: z.string(), thresholds: z.unknown() })
  .partial()
  .passthrough();
export const DeviceResponseSchema = apiEnvelope(DeviceDataSchema);
export type ApiDeviceResponse = z.infer<typeof DeviceResponseSchema>;
