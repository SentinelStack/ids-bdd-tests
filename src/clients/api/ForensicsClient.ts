import { BaseClient } from '../BaseClient';
export class ForensicsClient extends BaseClient {
  packets(body: unknown) { return this.post('/api/forensics/packets', body); }
  list(query = '') { return this.get(`/api/forensics${query}`); }
}
