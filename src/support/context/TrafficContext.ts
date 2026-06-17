import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

export class TrafficContext extends AliasResponseStore {
  static readonly DEFAULT_TRAFFIC_ALIAS = 'traffic1';

  setStats(alias: string, apiRes: HttpResponse): void { this.put(alias, 'stats', apiRes); }
  getStats(alias: string) { return this.take(alias, 'stats'); }
}
