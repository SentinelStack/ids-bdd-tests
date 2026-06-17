import { BaseClient } from '../BaseClient';
/** Endpoint-urile agentului de margine (autentificate cu cheia API) + acțiuni de operator. */
export class DevicesClient extends BaseClient {
  register(body: unknown) { return this.post('/api/devices/register', body); }
  heartbeat(deviceId: string, body: unknown) { return this.post(`/api/devices/${deviceId}/heartbeat`, body); }
  ruleset(deviceId: string) { return this.get(`/api/devices/${deviceId}/ruleset`); }
  rulesetByQuery(deviceId: string, apiKey: string) { return this.get(`/api/devices/${deviceId}/ruleset?apiKey=${encodeURIComponent(apiKey)}`); }
  list() { return this.get('/api/devices'); }
  quarantine(deviceId: string) { return this.post(`/api/devices/${deviceId}/quarantine`); }
  release(deviceId: string) { return this.post(`/api/devices/${deviceId}/release`); }
}
