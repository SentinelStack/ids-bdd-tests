import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class ForensicsClient extends BaseClient {
  packets(body: unknown, headers?: HeaderMap) { return this.post('/api/forensics/packets', body, headers); }
  list(query = '', headers?: HeaderMap) { return this.get(`/api/forensics${query}`, headers); }

  listByDevice(deviceId: string, headers?: HeaderMap) {
    return this.list(`?deviceId=${encodeURIComponent(deviceId)}`, headers);
  }
}
