import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

/** Alertele: ingestie (agent, cheia API) + listare/filtrare/confirmare (operator). Fiecare metodă
 *  acceptă un override opțional de headere, ca pașii negativi să forțeze 401 / cheie invalidă. */
export class AlertsClient extends BaseClient {
  create(body: unknown, headers?: HeaderMap) { return this.post('/api/alerts', body, headers); }
  list(query = '', headers?: HeaderMap) { return this.get(`/api/alerts${query}`, headers); }
  acknowledge(alertId: string, headers?: HeaderMap) { return this.post(`/api/alerts/${alertId}/acknowledge`, undefined, headers); }
}
