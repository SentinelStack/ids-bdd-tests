import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class ConsoleClient extends BaseClient {
  index(headers?: HeaderMap) { return this.get('/api', headers); }
  dashboard(headers?: HeaderMap) { return this.get('/api/console/dashboard', headers); }
  incidents(query = '', headers?: HeaderMap) { return this.get(`/api/console/incidents${query}`, headers); }
}
