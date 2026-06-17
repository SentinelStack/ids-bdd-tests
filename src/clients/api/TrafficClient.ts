import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class TrafficClient extends BaseClient {
  stats(body: unknown, headers?: HeaderMap) { return this.post('/api/traffic/stats', body, headers); }
  list(query = '', headers?: HeaderMap) { return this.get(`/api/traffic${query}`, headers); }
}
