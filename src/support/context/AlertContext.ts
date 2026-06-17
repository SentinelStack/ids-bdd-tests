import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

/** Contextul domeniului ALERTS: ține minte alertele ingerate de agent, pe alias. */
export class AlertContext extends AliasResponseStore {
  static readonly DEFAULT_ALERT_ALIAS = 'alert1';

  setIngest(alias: string, apiRes: HttpResponse): void { this.put(alias, 'ingest', apiRes); }
  getIngest(alias: string) { return this.take(alias, 'ingest'); }
}
