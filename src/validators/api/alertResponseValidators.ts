import { expect } from '@playwright/test';
import { AlertSchema } from '../../schemas/zod/alert.zod';
import { HttpResponse } from '../../clients/http';

export function validateAlertCollection(res: HttpResponse<any>): void {
  const data = res.body?.data?.content ?? res.body?.data ?? [];
  const parsed = AlertSchema.array().safeParse(Array.isArray(data) ? data : [data]);
  expect(parsed.success, `răspunsul de alertă nu respectă schema: ${JSON.stringify(parsed)}`).toBe(true);
}
