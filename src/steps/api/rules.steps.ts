import { expect } from '@playwright/test';
import { Given, When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { RulesContext } from '@support/context/RulesContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiRuleResponse, ApiRuleListResponse } from 'src/schemas/zod/rules';

// ==============================================================================
// RULES — pași în modelul „world / state / context per domeniu"
// ==============================================================================

// Override-uri de headere pentru cazurile negative (forțează 401). Regulile sunt
// endpoint de operator (Bearer), deci anulăm doar antetul de autentificare.
const NO_AUTH: HeaderMap = { authorization: '' };
const UNKNOWN_RULE_ID = 'EDGE-RULE-DOES-NOT-EXIST-999';

/** O singură regulă din plicul listei. */
interface RuleSummary { ruleId: string; name?: string; category?: string; enabled?: boolean }

/** Extrage tabloul de reguli din data.content al ultimului răspuns. */
function ruleListFrom(body: unknown): RuleSummary[] {
  const data = (body as ApiRuleListResponse)?.data;
  return Array.isArray(data?.content) ? (data!.content as RuleSummary[]) : [];
}

/** Publică ultimul răspuns în starea partajată (cod de stare + corp). */
function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

/** Id-ul regulii capturate anterior din lista stocată pentru un alias. */
function capturedRuleId(world: UnifiedWorld, alias: string): string {
  const body = world.api.rulesCtx.getList(alias).apiRes.body;
  const first = ruleListFrom(body)[0];
  if (!first) throw new Error(`nu există nicio regulă capturată pentru alias-ul „${alias}"`);
  return first.ruleId;
}

/** Starea curentă „enabled" a primei reguli capturate pentru un alias. */
function capturedRuleEnabled(world: UnifiedWorld, alias: string): boolean {
  const body = world.api.rulesCtx.getList(alias).apiRes.body;
  return ruleListFrom(body)[0]?.enabled === true;
}

// ── Setup ─────────────────────────────────────────────────────────────────────
Given(
  /^an existing rule is captured from the rule list(?: as (rule\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, RulesContext.DEFAULT_RULE_ALIAS, 'rule');
    const res = await world.api.rulesClient.list();
    world.api.rulesCtx.setList(alias, res);
    if (ruleListFrom(res.body).length === 0) throw new Error('lista de reguli e goală — nu pot captura un id');
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Precondiție: regulă capturată din listă');
  },
);

// ── List (operator) ─────────────────────────────────────────────────────────
When(/^I list the rules as the operator$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.rulesClient.list());
});

When(
  /^I list the rules filtered by category "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, category: string) => {
    setState(world, await world.api.rulesClient.listByCategory(category));
    world.api.log.info({ category, statusCode: world.api.state.statusCode }, 'Listare reguli filtrate pe categorie');
  },
);

When(
  /^I list the rules matching the search text "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, text: string) => {
    setState(world, await world.api.rulesClient.listByText(text));
    world.api.log.info({ text, statusCode: world.api.state.statusCode }, 'Listare reguli pe text liber');
  },
);

When(/^I list the rules without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.rulesClient.list('', NO_AUTH));
});

// ── Toggle (operator) ─────────────────────────────────────────────────────────
When(
  /^I toggle the captured rule(?: (rule\d+))? to enabled "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken: string | undefined, enabled: string) => {
    const alias = normalizeAlias(aliasToken, RulesContext.DEFAULT_RULE_ALIAS, 'rule');
    const res = await world.api.rulesClient.toggle(capturedRuleId(world, alias), enabled === 'true');
    setState(world, res);
    world.api.log.info({ alias, enabled, statusCode: res.statusCode }, 'Comutare regulă');
  },
);

When(
  /^I flip the captured rule(?: (rule\d+))? to its opposite state$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, RulesContext.DEFAULT_RULE_ALIAS, 'rule');
    const res = await world.api.rulesClient.toggle(capturedRuleId(world, alias), !capturedRuleEnabled(world, alias));
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Inversare stare regulă');
  },
);

When(
  /^I toggle an unknown rule to enabled "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, enabled: string) => {
    setState(world, await world.api.rulesClient.toggle(UNKNOWN_RULE_ID, enabled === 'true'));
  },
);

When(
  /^I update the captured rule(?: (rule\d+))? with the body '([^']*)'$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken: string | undefined, body: string) => {
    const alias = normalizeAlias(aliasToken, RulesContext.DEFAULT_RULE_ALIAS, 'rule');
    setState(world, await world.api.rulesClient.updateRaw(capturedRuleId(world, alias), JSON.parse(body)));
  },
);

When(
  /^I toggle the captured rule(?: (rule\d+))? without authentication$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, RulesContext.DEFAULT_RULE_ALIAS, 'rule');
    setState(world, await world.api.rulesClient.toggle(capturedRuleId(world, alias), false, NO_AUTH));
  },
);

// ── Aserții specifice domeniului ──────────────────────────────────────────────
Then(/^the rules response contains a list of rules$/, async ({ world }: { world: UnifiedWorld }) => {
  const rules = ruleListFrom(world.api.state.body);
  expect(Array.isArray(rules), `aștept un tablou de reguli, am: ${JSON.stringify(world.api.state.body)}`).toBe(true);
});

Then(
  /^every returned rule has category "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, category: string) => {
    const rules = ruleListFrom(world.api.state.body);
    const offending = rules.filter((r) => r.category !== category);
    expect(offending.length, `aștept ca toate regulile să aibă categoria „${category}"`).toBe(0);
  },
);

Then(
  /^the returned rule reports enabled "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, enabled: string) => {
    const data = (world.api.state.body as ApiRuleResponse)?.data;
    expect(data?.enabled).toBe(enabled === 'true');
  },
);
