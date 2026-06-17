import { AliasResponseStore } from '@support/context/AliasResponseStore';
import { HttpResponse } from 'src/clients/http';

export class DeviceContext extends AliasResponseStore {
  static readonly DEFAULT_DEVICE_ALIAS = 'device1';

  setRegister(alias: string, apiRes: HttpResponse): void { this.put(alias, 'register', apiRes); }
  getRegister(alias: string) { return this.take(alias, 'register'); }
}
