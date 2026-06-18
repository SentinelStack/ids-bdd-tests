import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

export class RulesClient extends BaseClient {
  list(query = '', headers?: HeaderMap) { return this.get(`/api/rules${query}`, headers); }

  listByCategory(category: string, headers?: HeaderMap) { return this.get(`/api/rules?category=${encodeURIComponent(category)}`, headers); }

  enable(ruleId: string, headers?: HeaderMap) { return this.post(`/api/rules/${ruleId}/enable`, undefined, headers); }

  disable(ruleId: string, headers?: HeaderMap) { return this.post(`/api/rules/${ruleId}/disable`, undefined, headers); }
}
