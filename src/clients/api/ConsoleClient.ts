import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

/** Vizualizările pre-calculate pentru consolă (index public + dashboard/incidents de operator).
 *  Fiecare metodă acceptă un override opțional de headere, ca pașii negativi să forțeze 401. */
export class ConsoleClient extends BaseClient {
  index(headers?: HeaderMap) { return this.get('/api', headers); }
  dashboard(headers?: HeaderMap) { return this.get('/api/console/dashboard', headers); }
  incidents(query = '', headers?: HeaderMap) { return this.get(`/api/console/incidents${query}`, headers); }
}
