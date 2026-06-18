import { nowIso } from 'src/data/generators/timestampGenerator';
export function newTrafficStats(overrides: Record<string, unknown> = {}) {
  return {
    deviceId: 'router-qa-01',
    timestamp: nowIso(),
    totalPackets: 842,
    tcpPackets: 620,
    udpPackets: 222,
    totalBytes: 512_344,
    tcpBytes: 400_000,
    udpBytes: 112_344,
    windowSeconds: 5,
    ...overrides,
  };
}
