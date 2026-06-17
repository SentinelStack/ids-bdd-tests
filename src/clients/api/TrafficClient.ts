import { BaseClient } from '../BaseClient';
export class TrafficClient extends BaseClient {
  stats(body: unknown) { return this.post('/api/traffic/stats', body); }
  list(query = '') { return this.get(`/api/traffic${query}`); }
}
