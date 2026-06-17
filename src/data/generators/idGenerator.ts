import { randomUUID } from 'node:crypto';
export const uuid = (): string => randomUUID();
export const shortId = (prefix = 'tst'): string => `${prefix}-${Math.random().toString(16).slice(2, 10)}`;
