import { Given, When, Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';
import { RulesClient } from '../../clients/api/RulesClient';

/** Shape of a single rule as returned inside the list envelope's data.content. */
interface RuleSummary {
  ruleId: string;
  name?: string;
  category?: string;
  enabled?: boolean;
}

/** Read the rules array out of whichever envelope shape the last response carries. */
function ruleListFrom(body: unknown): RuleSummary[] {
  const data = (body as { data?: { content?: RuleSummary[] } })?.data;
  return Array.isArray(data?.content) ? data!.content! : [];
}

// ---------------------------------------------------------------------------
// GET /api/rules
// ---------------------------------------------------------------------------

When('the rule list is requested', async ({ api }) => {
  api.lastResponse = await api.rules.list();
});

When('the rule list is requested filtered by category {string}', async ({ api }, category: string) => {
  api.lastResponse = await api.rules.listByCategory(category);
});

When('the rule list is requested with the search text {string}', async ({ api }, text: string) => {
  api.lastResponse = await api.rules.listByText(text);
});

When('the rule list is requested without authentication', async ({ api, env }) => {
  const anonymous = new RulesClient(env.apiBaseUrl);
  api.lastResponse = await anonymous.list();
});

Then('the rule list payload is an array', async ({ api }) => {
  const rules = ruleListFrom(api.lastResponse!.body);
  if (!Array.isArray(rules)) throw new Error('expected the rule list payload to be an array');
});

Then('every returned rule has category {string}', async ({ api }, category: string) => {
  const rules = ruleListFrom(api.lastResponse!.body);
  const offending = rules.filter((r) => r.category !== category);
  if (offending.length > 0) {
    throw new Error(`expected every rule to have category "${category}", found ${offending.length} other(s)`);
  }
});

// ---------------------------------------------------------------------------
// Shared prerequisite: capture a real rule id from the list
// ---------------------------------------------------------------------------

Given('an existing rule id is captured from the rule list', async ({ api }) => {
  const res = await api.rules.list();
  expectStatus(res, 200);
  const rules = ruleListFrom(res.body);
  if (rules.length === 0) throw new Error('no rules available to capture an id from');
  const rule = rules[0];
  api.context.set('ruleId', rule.ruleId);
  api.context.set('ruleEnabled', rule.enabled === true);
});

// ---------------------------------------------------------------------------
// PUT /api/rules/{ruleId}
// ---------------------------------------------------------------------------

When('the captured rule is toggled to enabled {string}', async ({ api }, enabled: string) => {
  const ruleId = api.context.get<string>('ruleId');
  api.lastResponse = await api.rules.toggle(ruleId, enabled === 'true');
});

When('the captured rule enabled flag is flipped', async ({ api }) => {
  const ruleId = api.context.get<string>('ruleId');
  const current = api.context.get<boolean>('ruleEnabled');
  api.lastResponse = await api.rules.toggle(ruleId, !current);
});

When('rule {string} is toggled to enabled {string}', async ({ api }, ruleId: string, enabled: string) => {
  api.lastResponse = await api.rules.toggle(ruleId, enabled === 'true');
});

When('the captured rule is updated with the body {string}', async ({ api }, body: string) => {
  const ruleId = api.context.get<string>('ruleId');
  api.lastResponse = await api.rules.updateRaw(ruleId, JSON.parse(body));
});

When('rule {string} is toggled without authentication', async ({ api, env }, ruleId: string) => {
  const anonymous = new RulesClient(env.apiBaseUrl);
  api.lastResponse = await anonymous.toggle(ruleId, false);
});

Then('the returned rule reports enabled {string}', async ({ api }, enabled: string) => {
  const data = (api.lastResponse!.body as { data?: RuleSummary })?.data;
  const expected = enabled === 'true';
  if (data?.enabled !== expected) {
    throw new Error(`expected the returned rule to report enabled=${expected}, got ${String(data?.enabled)}`);
  }
});
