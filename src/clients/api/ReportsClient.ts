import { BaseClient } from '../BaseClient';
/** Serviciul de export (rutat de nginx pe /api/reports/). */
export class ReportsClient extends BaseClient {
  meta() { return this.get('/api/reports/meta'); }
  preview(query = '') { return this.get(`/api/reports/alerts/preview${query}`); }
  download(query = '') { return this.get(`/api/reports/alerts/download${query}`); }
  curated() { return this.get('/api/reports/curated'); }
}
