import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

/** Endpoint-urile forensics: ingest de pachete (agent, cheia API) + listare (operator).
 *  Fiecare metodă acceptă un override opțional de headere, ca pașii negativi să forțeze 401. */
export class ForensicsClient extends BaseClient {
  packets(body: unknown, headers?: HeaderMap) { return this.post('/api/forensics/packets', body, headers); }
  list(query = '', headers?: HeaderMap) { return this.get(`/api/forensics${query}`, headers); }

  /** Listare filtrată pe dispozitiv (helper pentru pașii care cer un anumit deviceId). */
  listByDevice(deviceId: string, headers?: HeaderMap) {
    return this.list(`?deviceId=${encodeURIComponent(deviceId)}`, headers);
  }
}
