import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

export class ConsoleContext extends AliasResponseStore {
  static readonly DEFAULT_CONSOLE_ALIAS = 'console1';

  setView(alias: string, apiRes: HttpResponse): void { this.put(alias, 'view', apiRes); }
  getView(alias: string) { return this.take(alias, 'view'); }
}
