import { shortId } from 'src/data/generators/idGenerator';
import { nowIso } from 'src/data/generators/timestampGenerator';

/** Builds a representative captured-packet summary (metadata only, no PCAP payload). */
export function newPacketSummary(overrides: Record<string, unknown> = {}) {
  return {
    packetId: shortId('pkt'),
    deviceId: shortId('dev'),
    protocol: 'TCP',
    sourceIp: '198.51.100.7',
    sourcePort: 51514,
    destinationIp: '192.0.2.10',
    destinationPort: 443,
    length: 1480,
    flags: 'SYN',
    capturedAt: nowIso(),
    ...overrides,
  };
}
