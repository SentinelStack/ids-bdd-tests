import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

/** Regulile de detecție de margine (operator). Fiecare metodă acceptă un override opțional
 *  de headere, ca pașii negativi să forțeze 401 / token lipsă. */
export class RulesClient extends BaseClient {
  list(query = '', headers?: HeaderMap) { return this.get(`/api/rules${query}`, headers); }
  /** List rules filtered by detection category (e.g. DDOS, PORT_SCAN). */
  listByCategory(category: string, headers?: HeaderMap) { return this.get(`/api/rules?category=${encodeURIComponent(category)}`, headers); }
  /** List rules filtered by a free-text query (matched against name/signal). */
  listByText(text: string, headers?: HeaderMap) { return this.get(`/api/rules?q=${encodeURIComponent(text)}`, headers); }
  toggle(ruleId: string, enabled: boolean, headers?: HeaderMap) { return this.put(`/api/rules/${ruleId}`, { enabled }, headers); }
  /** Send an arbitrary (possibly invalid) body to the update endpoint, for negative tests. */
  updateRaw(ruleId: string, body: unknown, headers?: HeaderMap) { return this.put(`/api/rules/${ruleId}`, body, headers); }
}
