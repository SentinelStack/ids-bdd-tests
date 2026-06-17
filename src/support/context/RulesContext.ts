import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

export class RulesContext extends AliasResponseStore {
  static readonly DEFAULT_RULE_ALIAS = 'rule1';

  setList(alias: string, apiRes: HttpResponse): void { this.put(alias, 'list', apiRes); }
  getList(alias: string) { return this.take(alias, 'list'); }
}
