import { expect } from '@playwright/test';
import { DeviceSchema } from 'src/schemas/zod/device.zod';
import { HttpResponse } from 'src/clients/http';

export function validateDevice(res: HttpResponse<any>): void {
  const data = res.body?.data;
  expect(DeviceSchema.partial().safeParse(data).success, 'dispozitivul nu respectă schema').toBe(true);
}
