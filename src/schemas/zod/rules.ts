import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

export const RuleDataSchema = z
  .object({ ruleId: z.string(), name: z.string(), category: z.string(), enabled: z.boolean() })
  .partial()
  .passthrough();

export const RuleListDataSchema = z
  .object({ content: z.array(RuleDataSchema) })
  .partial()
  .passthrough();

export const RuleResponseSchema = apiEnvelope(RuleDataSchema);
export const RuleListResponseSchema = apiEnvelope(RuleListDataSchema);

export type ApiRuleResponse = z.infer<typeof RuleResponseSchema>;
export type ApiRuleListResponse = z.infer<typeof RuleListResponseSchema>;
