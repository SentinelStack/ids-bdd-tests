import { HttpResponse } from 'src/clients/http';

export interface StoredApiRes { apiRes: HttpResponse }

export class AliasResponseStore {
  private readonly store = new Map<string, HttpResponse>();

  protected put(alias: string, label: string, apiRes: HttpResponse): void {
    this.store.set(`${alias}::${label}`, apiRes);
  }

  protected take(alias: string, label: string): StoredApiRes {
    const apiRes = this.store.get(`${alias}::${label}`);
    if (!apiRes) throw new Error(`Nu există un răspuns „${label}" stocat pentru alias-ul „${alias}"`);
    return { apiRes };
  }
}
