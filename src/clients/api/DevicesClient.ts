import { BaseClient } from '../BaseClient';
/** Endpoint-urile agentului de margine (autentificate cu cheia API). */
export class DevicesClient extends BaseClient {
  register(body: unknown) { return this.post('/api/devices/register', body); }
  heartbeat(deviceId: string, body: unknown) { return this.post(`/api/devices/${deviceId}/heartbeat`, body); }
  ruleset(deviceId: string) { return this.get(`/api/devices/${deviceId}/ruleset`); }
  list() { return this.get('/api/devices'); }
}
