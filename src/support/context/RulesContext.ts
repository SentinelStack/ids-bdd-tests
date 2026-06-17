import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

/** Contextul domeniului RULES: ține minte răspunsul listei de reguli, pe alias. */
export class RulesContext extends AliasResponseStore {
  static readonly DEFAULT_RULE_ALIAS = 'rule1';

  setList(alias: string, apiRes: HttpResponse): void { this.put(alias, 'list', apiRes); }
  getList(alias: string) { return this.take(alias, 'list'); }
}
