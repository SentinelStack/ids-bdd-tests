import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

/** Endpoint-urile de trafic: ingest agent (cheia API) + overview operator. Fiecare metodă
 *  acceptă un override opțional de headere, ca pașii negativi să forțeze 401 / cheie invalidă. */
export class TrafficClient extends BaseClient {
  stats(body: unknown, headers?: HeaderMap) { return this.post('/api/traffic/stats', body, headers); }
  list(query = '', headers?: HeaderMap) { return this.get(`/api/traffic${query}`, headers); }
}
