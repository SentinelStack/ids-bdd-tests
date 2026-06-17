import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class DevicesClient extends BaseClient {
  register(body: unknown, headers?: HeaderMap) { return this.post('/api/devices/register', body, headers); }
  heartbeat(deviceId: string, body: unknown, headers?: HeaderMap) { return this.post(`/api/devices/${deviceId}/heartbeat`, body, headers); }
  ruleset(deviceId: string, headers?: HeaderMap) { return this.get(`/api/devices/${deviceId}/ruleset`, headers); }
  rulesetByQuery(deviceId: string, apiKey: string, headers?: HeaderMap) { return this.get(`/api/devices/${deviceId}/ruleset?apiKey=${encodeURIComponent(apiKey)}`, headers); }
  list(headers?: HeaderMap) { return this.get('/api/devices', headers); }
  quarantine(deviceId: string, headers?: HeaderMap) { return this.post(`/api/devices/${deviceId}/quarantine`, undefined, headers); }
  release(deviceId: string, headers?: HeaderMap) { return this.post(`/api/devices/${deviceId}/release`, undefined, headers); }
}
