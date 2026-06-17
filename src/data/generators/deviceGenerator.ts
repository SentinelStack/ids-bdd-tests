import { shortId } from 'src/data/generators/idGenerator';

export function newDevice(overrides: Record<string, unknown> = {}) {
  return { name: `router-${shortId()}`, ipAddress: '192.0.2.10', firmware: '23.05.3', model: 'test-router', ...overrides };
}
export function newHeartbeat(overrides: Record<string, unknown> = {}) {
  return { cpuPercent: 12, memPercent: 34, seenAt: new Date().toISOString(), ...overrides };
}
