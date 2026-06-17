import { shortId } from './idGenerator';
import { nowIso } from './timestampGenerator';
/** Construiește o alertă reprezentativă (de pildă o scanare de porturi). */
export function newAlert(overrides: Record<string, unknown> = {}) {
  return {
    alertId: shortId('alr'),
    type: 'PORT_SCAN_SUSPECTED',
    severity: 'HIGH',
    protocol: 'TCP',
    sourceIp: '198.51.100.7',
    destinationIp: '192.0.2.10',
    packets: 1500,
    bytes: 90_000,
    timestamp: nowIso(),
    description: 'Possible port scan detected in window',
    ...overrides,
  };
}
