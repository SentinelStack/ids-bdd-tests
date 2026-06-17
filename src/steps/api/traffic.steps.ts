import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { TrafficContext } from '@support/context/TrafficContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiTrafficStatsResponse } from 'src/schemas/zod/traffic';

// ==============================================================================
// TRAFFIC — pași în modelul „world / state / context per domeniu"
//   POST /api/traffic/stats  (agent, cheia API)   -> 201
//   GET  /api/traffic        (operator, Bearer)   -> 200
// ==============================================================================

// Override-uri de headere pentru cazurile negative (forțează 401 / cheie invalidă).
const NO_API_KEY: HeaderMap = { 'x-api-key': '' };
const BAD_API_KEY: HeaderMap = { 'x-api-key': 'not-a-real-key' };
const NO_AUTH: HeaderMap = { 'x-api-key': '', authorization: '' };

/** Fereastră validă de statistici de trafic, randomizată cu faker. */
function validTrafficStats(overrides: Record<string, unknown> = {}) {
  const tcp = faker.number.int({ min: 100, max: 800 });
  const udp = faker.number.int({ min: 50, max: 400 });
  return {
    totalPackets: tcp + udp,
    tcpPackets: tcp,
    udpPackets: udp,
    totalBytes: faker.number.int({ min: 10_000, max: 5_000_000 }),
    windowSeconds: faker.helpers.arrayElement([5, 10, 30, 60]),
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

/** Publică ultimul răspuns în starea partajată (cod de stare + corp). */
function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

// ── POST /api/traffic/stats (agent ingest) ─────────────────────────────────────
When(
  /^the agent submits valid traffic statistics(?: (traffic\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, TrafficContext.DEFAULT_TRAFFIC_ALIAS, 'traffic');
    const res = await world.api.trafficClient.stats(validTrafficStats());
    world.api.trafficCtx.setStats(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Ingest statistici de trafic');
  },
);

When(
  /^the agent submits traffic statistics with the "([^"]*)" counter set to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, field: string, value: string) => {
    const res = await world.api.trafficClient.stats(validTrafficStats({ [field]: value }));
    setState(world, res);
    world.api.log.info({ field, value, statusCode: res.statusCode }, 'Ingest cu contor suprascris');
  },
);

When(
  /^the agent submits traffic statistics with the "([^"]*)" counter set to (-?\d+)$/,
  async ({ world }: { world: UnifiedWorld }, field: string, value: string) => {
    const res = await world.api.trafficClient.stats(validTrafficStats({ [field]: Number(value) }));
    setState(world, res);
    world.api.log.info({ field, value, statusCode: res.statusCode }, 'Ingest cu contor numeric suprascris');
  },
);

When(
  /^the agent submits traffic statistics without the "([^"]*)" counter$/,
  async ({ world }: { world: UnifiedWorld }, field: string) => {
    const stats = validTrafficStats();
    delete (stats as Record<string, unknown>)[field];
    const res = await world.api.trafficClient.stats(stats);
    setState(world, res);
    world.api.log.info({ field, statusCode: res.statusCode }, 'Ingest cu contor lipsă');
  },
);

When(/^the agent submits traffic statistics without an API key$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.trafficClient.stats(validTrafficStats(), NO_API_KEY));
});

When(/^the agent submits traffic statistics with an invalid API key$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.trafficClient.stats(validTrafficStats(), BAD_API_KEY));
});

// ── GET /api/traffic (operator overview/list) ──────────────────────────────────
When(/^the operator requests the traffic overview$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.trafficClient.list());
});

When(
  /^the operator requests the traffic overview for the last (\d+) seconds$/,
  async ({ world }: { world: UnifiedWorld }, seconds: string) => {
    const from = encodeURIComponent(new Date(Date.now() - Number(seconds) * 1000).toISOString());
    const to = encodeURIComponent(new Date().toISOString());
    setState(world, await world.api.trafficClient.list(`?from=${from}&to=${to}`));
  },
);

When(
  /^the operator requests the traffic overview with the time range "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, range: string) => {
    setState(world, await world.api.trafficClient.list(range));
  },
);

When(/^the operator requests the traffic overview without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.trafficClient.list('', NO_AUTH));
});

// ── Aserții specifice domeniului ──────────────────────────────────────────────
Then(/^the traffic response carries an identifier$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiTrafficStatsResponse;
  const id = body.data?.id;
  expect(id !== undefined && id !== null && String(id).length > 0, `aștept un id pe fereastra acceptată, am: ${JSON.stringify(body)}`).toBe(true);
});

Then(/^the traffic overview contains a list of windows$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = (world.api.state.body as { data?: unknown }).data;
  const items = Array.isArray(data) ? data : (data as { items?: unknown })?.items;
  expect(Array.isArray(items), 'aștept ca overview-ul de trafic să conțină o listă de ferestre').toBe(true);
});
