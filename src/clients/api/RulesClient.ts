import { BaseClient } from '../BaseClient';
/** Regulile de detecție de margine (operator). */
export class RulesClient extends BaseClient {
  list(query = '') { return this.get(`/api/rules${query}`); }
  toggle(ruleId: string, enabled: boolean) { return this.put(`/api/rules/${ruleId}`, { enabled }); }
}
