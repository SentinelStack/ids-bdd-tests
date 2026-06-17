import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

/** Contextul domeniului ACCOUNT: ține minte autentificările (login/mfa/google), pe alias. */
export class AccountContext extends AliasResponseStore {
  static readonly DEFAULT_ACCOUNT_ALIAS = 'account1';

  setLogin(alias: string, apiRes: HttpResponse): void { this.put(alias, 'login', apiRes); }
  getLogin(alias: string) { return this.take(alias, 'login'); }
}
