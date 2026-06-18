import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Given, When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { AlertContext } from '@support/context/AlertContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiAlertResponse } from 'src/schemas/zod/alerts';

const NO_API_KEY: HeaderMap = { 'x-api-key': '' };
const NO_AUTH: HeaderMap = { 'x-api-key': '', authorization: '' };
const UNKNOWN_ID = '00000000-0000-0000-0000-000000000000';

function validAlertPayload(overrides: Record<string, unknown> = {}) {
  return {
    deviceId: `dev-${faker.string.alphanumeric(8).toLowerCase()}`,
    timestamp: new Date().toISOString(),
    type: 'PORT_SCAN_SUSPECTED',
    severity: faker.helpers.arrayElement(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
    protocol: faker.helpers.arrayElement(['TCP', 'UDP', 'ICMP', 'UNKNOWN']),
    sourceIp: faker.internet.ipv4(),
    destinationIp: faker.internet.ipv4(),
    sourcePort: faker.number.int({ min: 0, max: 65535 }),
    destinationPort: faker.number.int({ min: 0, max: 65535 }),
    packetCount: faker.number.int({ min: 100, max: 5000 }),
    bytesCount: faker.number.int({ min: 10_000, max: 500_000 }),
    windowSeconds: faker.number.int({ min: 1, max: 300 }),
    description: 'Possible port scan detected in window',
    ...overrides,
  };
}

function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

function ingestedId(world: UnifiedWorld, alias: string): string {
  const body = world.api.alertCtx.getIngest(alias).apiRes.body as ApiAlertResponse;
  return body.data?.alertId ?? 'AlertIdMissing';
}

When(
  /^the agent ingests a new alert(?: (alert\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, AlertContext.DEFAULT_ALERT_ALIAS, 'alert');
    const res = await world.api.alertsClient.create(validAlertPayload());
    world.api.alertCtx.setIngest(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Ingestie alertă');
  },
);

When(
  /^the agent ingests an alert with severity "([^"]*)" protocol "([^"]*)" source ip "([^"]*)"(?: (alert\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, severity: string, protocol: string, sourceIp: string, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, AlertContext.DEFAULT_ALERT_ALIAS, 'alert');
    const res = await world.api.alertsClient.create(validAlertPayload({ severity, protocol, sourceIp }));
    world.api.alertCtx.setIngest(alias, res);
    setState(world, res);
    world.api.log.info({ alias, severity, protocol, sourceIp, statusCode: res.statusCode }, 'Ingestie alertă marcată');
  },
);

When(
  /^the agent ingests an alert with the "([^"]*)" field set to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, field: string, value: string) => {
    const res = await world.api.alertsClient.create(validAlertPayload({ [field]: value }));
    setState(world, res);
    world.api.log.info({ field, value, statusCode: res.statusCode }, 'Ingestie cu câmp suprascris');
  },
);

When(
  /^the agent ingests an alert with the "([^"]*)" field omitted$/,
  async ({ world }: { world: UnifiedWorld }, field: string) => {
    const payload = validAlertPayload();
    delete (payload as Record<string, unknown>)[field];
    const res = await world.api.alertsClient.create(payload);
    setState(world, res);
    world.api.log.info({ field, statusCode: res.statusCode }, 'Ingestie cu câmp lipsă');
  },
);

When(/^the agent ingests an alert without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.alertsClient.create(validAlertPayload(), NO_AUTH));
});

When(/^the agent ingests an alert with an invalid API key$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.alertsClient.create(validAlertPayload(), { 'x-api-key': 'not-a-real-key' }));
});

When(/^the operator lists the alerts$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.alertsClient.list());
});

When(
  /^the operator lists the alerts with query "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, query: string) => {
    setState(world, await world.api.alertsClient.list(query));
    world.api.log.info({ query, statusCode: world.api.state.statusCode }, 'Listare alerte filtrată');
  },
);

When(/^the operator lists the alerts without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.alertsClient.list('', NO_AUTH));
});

When(
  /^the operator acknowledges the ingested alert(?: (alert\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, AlertContext.DEFAULT_ALERT_ALIAS, 'alert');
    setState(world, await world.api.alertsClient.acknowledge(ingestedId(world, alias)));
  },
);

When(/^the operator acknowledges an unknown alert$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.alertsClient.acknowledge(UNKNOWN_ID));
});

When(
  /^the operator acknowledges the alert id "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, alertId: string) => {
    setState(world, await world.api.alertsClient.acknowledge(alertId));
  },
);

When(/^the operator acknowledges the ingested alert without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  const alias = AlertContext.DEFAULT_ALERT_ALIAS;
  setState(world, await world.api.alertsClient.acknowledge(ingestedId(world, alias), NO_AUTH));
});

When(/^the operator acknowledges an unknown alert without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.alertsClient.acknowledge(UNKNOWN_ID, NO_AUTH));
});

Then(/^the alert response contains an alert id$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiAlertResponse;
  expect(body.data?.alertId, `aștept data.alertId, am: ${JSON.stringify(body)}`).toBeTruthy();
});

Then(/^the alert list response is paged$/, async ({ world }: { world: UnifiedWorld }) => {
  const content = (world.api.state.body as { data?: { content?: unknown } }).data?.content;
  expect(Array.isArray(content), `aștept un plic paginat cu data.content tablou, am: ${JSON.stringify(world.api.state.body)}`).toBe(true);
});

Then(
  /^every listed alert has "([^"]*)" equal to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, field: string, value: string) => {
    const content = ((world.api.state.body as { data?: { content?: Array<Record<string, unknown>> } }).data?.content ?? []);
    expect(content.length, 'aștept cel puțin o alertă în pagina filtrată').toBeGreaterThan(0);
    const offenders = content.filter((a) => String(a[field]) !== value);
    expect(offenders.length, `aștept ca fiecare ${field} să fie „${value}", am ${offenders.length} nepotriviri`).toBe(0);
  },
);

Then(
  /^the alert page holds at most (\d+) items$/,
  async ({ world }: { world: UnifiedWorld }, size: string) => {
    const content = ((world.api.state.body as { data?: { content?: unknown[] } }).data?.content ?? []);
    expect(content.length, `aștept cel mult ${size} alerte pe pagină`).toBeLessThanOrEqual(Number(size));
  },
);
