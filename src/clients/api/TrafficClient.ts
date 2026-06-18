import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class TrafficClient extends BaseClient {
  stats(body: unknown, headers?: HeaderMap) { return this.post('/api/traffic/stats', body, headers); }
  summary(headers?: HeaderMap) { return this.get('/api/traffic/summary', headers); }
  latest(headers?: HeaderMap) { return this.get('/api/traffic/stats/latest', headers); }
  byDevice(deviceId: string, query = '', headers?: HeaderMap) {
    return this.get(`/api/traffic/stats/by-device/${deviceId}${query}`, headers);
  }
}
