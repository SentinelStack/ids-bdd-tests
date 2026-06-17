import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

/** Contextul domeniului FORENSICS: ține minte pachetele ingerate, pe alias. */
export class ForensicsContext extends AliasResponseStore {
  static readonly DEFAULT_FORENSICS_ALIAS = 'forensics1';

  setIngest(alias: string, apiRes: HttpResponse): void { this.put(alias, 'ingest', apiRes); }
  getIngest(alias: string) { return this.take(alias, 'ingest'); }
}
