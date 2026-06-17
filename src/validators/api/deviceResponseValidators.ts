import { expect } from '@playwright/test';
import { DeviceSchema } from '../../schemas/zod/device.zod';
import { HttpResponse } from '../../clients/http';

export function validateDevice(res: HttpResponse<any>): void {
  const data = res.body?.data;
  expect(DeviceSchema.partial().safeParse(data).success, 'dispozitivul nu respectă schema').toBe(true);
}
