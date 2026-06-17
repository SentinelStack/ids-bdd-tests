import { BaseClient } from '../BaseClient';
/** Alertele: ingestie (agent) + listare/filtrare/confirmare (operator). */
export class AlertsClient extends BaseClient {
  create(body: unknown) { return this.post('/api/alerts', body); }
  list(query = '') { return this.get(`/api/alerts${query}`); }
  acknowledge(alertId: string) { return this.post(`/api/alerts/${alertId}/acknowledge`); }
}
