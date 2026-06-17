import { expect } from '@playwright/test';
import { HttpResponse } from 'src/clients/http';

export function expectStatus(res: HttpResponse, expected: number): void {
  expect(res.status, `aștept status ${expected}, am primit ${res.status}: ${res.raw}`).toBe(expected);
}
export function expectEnvelopeSuccess(res: HttpResponse<any>): void {
  expect(res.body?.success, 'plicul de răspuns ar trebui să aibă success=true').toBe(true);
}
