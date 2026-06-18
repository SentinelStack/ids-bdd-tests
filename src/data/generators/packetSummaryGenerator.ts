import { shortId } from 'src/data/generators/idGenerator';
import { nowIso } from 'src/data/generators/timestampGenerator';

export function newPacketSummary(overrides: Record<string, unknown> = {}) {
  return {
    deviceId: shortId('dev'),
    timestamp: nowIso(),
    protocol: 'TCP',
    sourceIp: '198.51.100.7',
    sourcePort: 51514,
    destinationIp: '192.0.2.10',
    destinationPort: 443,
    packetSize: 1480,
    tcpFlags: 'SYN',
    ...overrides,
  };
}
