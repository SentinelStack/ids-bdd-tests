import { BaseClient } from '../BaseClient';
/** Vizualizările pre-calculate pentru consolă (operator). */
export class ConsoleClient extends BaseClient {
  index() { return this.get('/api'); }
  dashboard() { return this.get('/api/console/dashboard'); }
  incidents(query = '') { return this.get(`/api/console/incidents${query}`); }
}
