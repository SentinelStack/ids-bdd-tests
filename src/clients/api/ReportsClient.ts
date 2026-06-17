import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class ReportsClient extends BaseClient {
  meta(headers?: HeaderMap) { return this.get('/api/reports/meta', headers); }
  preview(query = '', headers?: HeaderMap) { return this.get(`/api/reports/alerts/preview${query}`, headers); }
  download(query = '', headers?: HeaderMap) { return this.get(`/api/reports/alerts/download${query}`, headers); }
  volume(query = '', headers?: HeaderMap) { return this.get(`/api/reports/volume${query}`, headers); }
  curated(headers?: HeaderMap) { return this.get('/api/reports/curated', headers); }
  curatedDownload(name: string, query = '', headers?: HeaderMap) {
    return this.get(`/api/reports/curated/${encodeURIComponent(name)}/download${query}`, headers);
  }
}
