import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

/** Contextul domeniului REPORTS: ține minte cataloagele cerute, pe alias, ca pașii
 *  de descărcare să se poată înlănțui după un catalog curat cerut anterior. */
export class ReportsContext extends AliasResponseStore {
  static readonly DEFAULT_REPORT_ALIAS = 'report1';

  setCatalog(alias: string, apiRes: HttpResponse): void { this.put(alias, 'catalog', apiRes); }
  getCatalog(alias: string) { return this.take(alias, 'catalog'); }
}
