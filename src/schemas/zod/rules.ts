import { z } from 'zod';
import { apiEnvelope } from 'src/schemas/zod/common';

/** O singură regulă de detecție de margine, așa cum apare în plicul listei sau al unui toggle. */
export const RuleDataSchema = z
  .object({ ruleId: z.string(), name: z.string(), category: z.string(), enabled: z.boolean() })
  .partial()
  .passthrough();

/** Plicul listei: data.content este tabloul de reguli (paginat). */
export const RuleListDataSchema = z
  .object({ content: z.array(RuleDataSchema) })
  .partial()
  .passthrough();

export const RuleResponseSchema = apiEnvelope(RuleDataSchema);
export const RuleListResponseSchema = apiEnvelope(RuleListDataSchema);

export type ApiRuleResponse = z.infer<typeof RuleResponseSchema>;
export type ApiRuleListResponse = z.infer<typeof RuleListResponseSchema>;
