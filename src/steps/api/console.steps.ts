import { expect } from '@playwright/test';
import { Given, When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { ConsoleContext } from '@support/context/ConsoleContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiConsoleResponse } from 'src/schemas/zod/console';

// ==============================================================================
// CONSOLE — vizualizări pre-calculate pentru operator, în modelul
// „world / state / context per domeniu". Index public + dashboard/incidents (operator).
// ==============================================================================

// Override-uri de headere pentru cazurile negative (forțează 401 fără Bearer-ul de operator).
const NO_AUTH: HeaderMap = { 'x-api-key': '', authorization: '' };

/** Publică ultimul răspuns în starea partajată (cod de stare + corp). */
function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

// ── Index hypermedia (public) ───────────────────────────────────────────────
When(
  /^the console index is requested(?: as (console\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ConsoleContext.DEFAULT_CONSOLE_ALIAS, 'console');
    const res = await world.api.consoleClient.index();
    world.api.consoleCtx.setView(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Index consolă cerut');
  },
);

When(/^the console index is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.consoleClient.index(NO_AUTH));
});

// ── Dashboard (operator) ────────────────────────────────────────────────────
When(
  /^the console dashboard is requested(?: as (console\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ConsoleContext.DEFAULT_CONSOLE_ALIAS, 'console');
    const res = await world.api.consoleClient.dashboard();
    world.api.consoleCtx.setView(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Dashboard consolă cerut');
  },
);

When(/^the console dashboard is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.consoleClient.dashboard(NO_AUTH));
});

// ── Incidents (operator, cu filtre) ─────────────────────────────────────────
When(/^the console incidents view is requested$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.consoleClient.incidents());
});

When(
  /^the console incidents view is requested filtered by status "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, status: string) => {
    setState(world, await world.api.consoleClient.incidents(`?status=${encodeURIComponent(status)}`));
  },
);

When(
  /^the console incidents view is requested filtered by severity "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, severity: string) => {
    setState(world, await world.api.consoleClient.incidents(`?severity=${encodeURIComponent(severity)}`));
  },
);

When(/^the console incidents view is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.consoleClient.incidents('', NO_AUTH));
});

When(
  /^the console incidents view is requested filtered by status "([^"]*)" without authentication$/,
  async ({ world }: { world: UnifiedWorld }, status: string) => {
    setState(world, await world.api.consoleClient.incidents(`?status=${encodeURIComponent(status)}`, NO_AUTH));
  },
);

// ── Aserții specifice domeniului ────────────────────────────────────────────
Then(/^the console index exposes navigation links$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiConsoleResponse;
  const data = (body.data ?? body) as Record<string, unknown>;
  const links = (data.links ?? data._links) as unknown;
  const count = Array.isArray(links) ? links.length : links ? Object.keys(links as object).length : 0;
  expect(count, `aștept linkuri de navigare în index, am: ${JSON.stringify(body)}`).toBeGreaterThan(0);
});

Then(/^the console dashboard payload is present$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiConsoleResponse;
  expect(body.data, `aștept un payload în data pentru dashboard, am: ${JSON.stringify(body)}`).not.toBeUndefined();
  expect(body.data).not.toBeNull();
});

// Precondiție de înlănțuire opțională: o vizualizare a fost deja cerută pentru un alias.
Given(
  /^the console dashboard has been requested(?: as (console\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ConsoleContext.DEFAULT_CONSOLE_ALIAS, 'console');
    const res = await world.api.consoleClient.dashboard();
    world.api.consoleCtx.setView(alias, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Precondiție: dashboard consolă cerut');
  },
);
