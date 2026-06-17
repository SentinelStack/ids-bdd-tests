import { BaseClient } from '../BaseClient';
/** Regulile de detecție de margine (operator). */
export class RulesClient extends BaseClient {
  list(query = '') { return this.get(`/api/rules${query}`); }
  /** List rules filtered by detection category (e.g. DDOS, PORT_SCAN). */
  listByCategory(category: string) { return this.get(`/api/rules?category=${encodeURIComponent(category)}`); }
  /** List rules filtered by a free-text query (matched against name/signal). */
  listByText(text: string) { return this.get(`/api/rules?q=${encodeURIComponent(text)}`); }
  toggle(ruleId: string, enabled: boolean) { return this.put(`/api/rules/${ruleId}`, { enabled }); }
  /** Send an arbitrary (possibly invalid) body to the update endpoint, for negative tests. */
  updateRaw(ruleId: string, body: unknown) { return this.put(`/api/rules/${ruleId}`, body); }
}
