import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

/** Endpoint-urile agentului de margine (cheia API) + acțiunile de operator. Fiecare metodă
 *  acceptă un override opțional de headere, ca pașii negativi să forțeze 401 / cheie invalidă. */
export class DevicesClient extends BaseClient {
  register(body: unknown, headers?: HeaderMap) { return this.post('/api/devices/register', body, headers); }
  heartbeat(deviceId: string, body: unknown, headers?: HeaderMap) { return this.post(`/api/devices/${deviceId}/heartbeat`, body, headers); }
  ruleset(deviceId: string, headers?: HeaderMap) { return this.get(`/api/devices/${deviceId}/ruleset`, headers); }
  rulesetByQuery(deviceId: string, apiKey: string, headers?: HeaderMap) { return this.get(`/api/devices/${deviceId}/ruleset?apiKey=${encodeURIComponent(apiKey)}`, headers); }
  list(headers?: HeaderMap) { return this.get('/api/devices', headers); }
  quarantine(deviceId: string, headers?: HeaderMap) { return this.post(`/api/devices/${deviceId}/quarantine`, undefined, headers); }
  release(deviceId: string, headers?: HeaderMap) { return this.post(`/api/devices/${deviceId}/release`, undefined, headers); }
}
