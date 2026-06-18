import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class AlertsClient extends BaseClient {
  create(body: unknown, headers?: HeaderMap) { return this.post('/api/alerts', body, headers); }
  list(query = '', headers?: HeaderMap) { return this.get(`/api/alerts${query}`, headers); }
  acknowledge(alertId: string, headers?: HeaderMap) { return this.patch(`/api/alerts/${alertId}/acknowledge`, undefined, headers); }
}
