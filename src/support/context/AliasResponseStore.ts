import { HttpResponse } from 'src/clients/http';

/** Pereche stocată în context: răspunsul API al unei operații anterioare. */
export interface StoredApiRes { apiRes: HttpResponse }

/**
 * Stochează răspunsuri API pe (alias, etichetă), ca pașii ulteriori să se poată
 * înlănțui după o operație anterioară (ex. „dispozitivul înregistrat la device2").
 */
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
