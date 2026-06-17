import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class RulesClient extends BaseClient {
  list(query = '', headers?: HeaderMap) { return this.get(`/api/rules${query}`, headers); }

  listByCategory(category: string, headers?: HeaderMap) { return this.get(`/api/rules?category=${encodeURIComponent(category)}`, headers); }

  listByText(text: string, headers?: HeaderMap) { return this.get(`/api/rules?q=${encodeURIComponent(text)}`, headers); }
  toggle(ruleId: string, enabled: boolean, headers?: HeaderMap) { return this.put(`/api/rules/${ruleId}`, { enabled }, headers); }

  updateRaw(ruleId: string, body: unknown, headers?: HeaderMap) { return this.put(`/api/rules/${ruleId}`, body, headers); }
}
