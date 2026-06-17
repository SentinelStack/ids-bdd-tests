import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const AccountDataSchema = z
  .object({
    accountId: z.string(),
    username: z.string(),
    token: z.string(),
    mfaRequired: z.boolean(),
    mfaToken: z.string(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
  })
  .partial()
  .passthrough();
export const AccountResponseSchema = apiEnvelope(AccountDataSchema);
export type ApiAccountResponse = z.infer<typeof AccountResponseSchema>;
