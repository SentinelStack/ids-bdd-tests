import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { TrafficContext } from '@support/context/TrafficContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiTrafficStatsResponse } from 'src/schemas/zod/traffic';

const NO_API_KEY: HeaderMap = { 'x-api-key': '' };
const BAD_API_KEY: HeaderMap = { 'x-api-key': 'not-a-real-key' };
const NO_AUTH: HeaderMap = { 'x-api-key': '', authorization: '' };

const KNOWN_DEVICE_ID = 'router-qa-01';

function validTrafficStats(overrides: Record<string, unknown> = {}) {
  const tcpPackets = faker.number.int({ min: 100, max: 800 });
  const udpPackets = faker.number.int({ min: 50, max: 400 });
  const tcpBytes = faker.number.int({ min: 10_000, max: 3_000_000 });
  const udpBytes = faker.number.int({ min: 5_000, max: 2_000_000 });
  return {
    deviceId: KNOWN_DEVICE_ID,
    timestamp: new Date().toISOString(),
    totalPackets: tcpPackets + udpPackets,
    tcpPackets,
    udpPackets,
    totalBytes: tcpBytes + udpBytes,
    tcpBytes,
    udpBytes,
    windowSeconds: faker.helpers.arrayElement([5, 10, 30, 60]),
    ...overrides,
  };
}

function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

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

When(/^a traffic-statistics window has been ingested for a known device$/, async ({ world }: { world: UnifiedWorld }) => {
  const res = await world.api.trafficClient.stats(validTrafficStats({ deviceId: KNOWN_DEVICE_ID }));
  setState(world, res);
  world.api.log.info({ deviceId: KNOWN_DEVICE_ID, statusCode: res.statusCode }, 'Seed fereastră pentru un dispozitiv cunoscut');
});

When(/^the operator requests the traffic summary$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.trafficClient.summary());
});

When(/^the operator requests the traffic summary without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.trafficClient.summary(NO_AUTH));
});

When(/^the operator requests the traffic windows for the known device$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.trafficClient.byDevice(KNOWN_DEVICE_ID, '?page=0&size=20'));
});

Then(/^the traffic response carries an identifier$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiTrafficStatsResponse;
  const deviceId = body.data?.deviceId;
  expect(deviceId !== undefined && deviceId !== null && String(deviceId).length > 0, `aștept un deviceId pe fereastra acceptată, am: ${JSON.stringify(body)}`).toBe(true);
});

Then(/^the traffic summary exposes aggregate counters$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = (world.api.state.body as { data?: { totalPackets?: unknown; totalBytes?: unknown } }).data;
  expect(typeof data?.totalPackets, `aștept un total agregat de pachete, am: ${JSON.stringify(data)}`).toBe('number');
  expect(typeof data?.totalBytes, `aștept un total agregat de octeți, am: ${JSON.stringify(data)}`).toBe('number');
});

Then(/^the traffic windows response contains a list of windows$/, async ({ world }: { world: UnifiedWorld }) => {
  const content = (world.api.state.body as { data?: { content?: unknown } }).data?.content;
  expect(Array.isArray(content), 'aștept ca răspunsul pe dispozitiv să conțină o listă de ferestre în data.content').toBe(true);
});
