import { nowIso } from 'src/data/generators/timestampGenerator';
export function newTrafficStats(overrides: Record<string, unknown> = {}) {
  return { totalPackets: 842, tcpPackets: 620, udpPackets: 222, totalBytes: 512_344, windowSeconds: 5, timestamp: nowIso(), ...overrides };
}
