import { shortId } from 'src/data/generators/idGenerator';
import { nowIso } from 'src/data/generators/timestampGenerator';

export function newAlert(overrides: Record<string, unknown> = {}) {
  return {
    deviceId: shortId('dev'),
    timestamp: nowIso(),
    type: 'PORT_SCAN_SUSPECTED',
    severity: 'HIGH',
    protocol: 'TCP',
    sourceIp: '198.51.100.7',
    destinationIp: '192.0.2.10',
    sourcePort: 40512,
    destinationPort: 443,
    packetCount: 1500,
    bytesCount: 90_000,
    windowSeconds: 60,
    description: 'Possible port scan detected in window',
    ...overrides,
  };
}
