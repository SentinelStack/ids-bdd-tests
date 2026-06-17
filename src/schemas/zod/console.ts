import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const ConsoleDataSchema = z
  .object({
    links: z.unknown(),
    _links: z.unknown(),
    incidents: z.unknown(),
    summary: z.unknown(),
  })
  .partial()
  .passthrough();
export const ConsoleResponseSchema = apiEnvelope(ConsoleDataSchema);
export type ApiConsoleResponse = z.infer<typeof ConsoleResponseSchema>;
