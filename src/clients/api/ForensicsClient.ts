import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class ForensicsClient extends BaseClient {
  packets(body: unknown, headers?: HeaderMap) { return this.post('/api/forensics/packets', body, headers); }
  list(query = '', headers?: HeaderMap) { return this.get(`/api/forensics/packets${query}`, headers); }
  byAlert(alertId: string, headers?: HeaderMap) { return this.get(`/api/forensics/by-alert/${encodeURIComponent(alertId)}`, headers); }
  timeline(query = '', headers?: HeaderMap) { return this.get(`/api/forensics/timeline${query}`, headers); }
}
