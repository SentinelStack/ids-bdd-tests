import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Given, When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { ForensicsContext } from '@support/context/ForensicsContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiForensicsResponse, ApiForensicsListResponse } from 'src/schemas/zod/forensics';

const NO_API_KEY: HeaderMap = { 'x-api-key': '' };
const BAD_API_KEY: HeaderMap = { 'x-api-key': 'not-a-real-key' };
const NO_AUTH: HeaderMap = { 'x-api-key': '', authorization: '' };

function validPacketPayload(overrides: Record<string, unknown> = {}) {
  return {
    deviceId: `dev-${faker.string.alphanumeric(8).toLowerCase()}`,
    timestamp: new Date().toISOString(),
    protocol: faker.helpers.arrayElement(['TCP', 'UDP', 'ICMP']),
    sourceIp: faker.internet.ipv4(),
    sourcePort: faker.internet.port(),
    destinationIp: faker.internet.ipv4(),
    destinationPort: faker.internet.port(),
    packetSize: faker.number.int({ min: 40, max: 1500 }),
    tcpFlags: faker.helpers.arrayElement(['SYN', 'ACK', 'PSH', 'FIN']),
    ...overrides,
  };
}

function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

When(
  /^I ingest a forensic packet(?: (forensics\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ForensicsContext.DEFAULT_FORENSICS_ALIAS, 'forensics');
    const res = await world.api.forensicsClient.packets(validPacketPayload());
    world.api.forensicsCtx.setIngest(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Ingest pachet forensic');
  },
);

When(
  /^I ingest a forensic packet for device "([^"]*)"(?: (forensics\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, deviceId: string, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ForensicsContext.DEFAULT_FORENSICS_ALIAS, 'forensics');
    const res = await world.api.forensicsClient.packets(validPacketPayload({ deviceId }));
    world.api.forensicsCtx.setIngest(alias, res);
    setState(world, res);
    world.api.log.info({ alias, deviceId, statusCode: res.statusCode }, 'Ingest pachet forensic pentru dispozitiv');
  },
);

When(
  /^I ingest a forensic packet with the "([^"]*)" field omitted$/,
  async ({ world }: { world: UnifiedWorld }, field: string) => {
    const payload = validPacketPayload();
    delete (payload as Record<string, unknown>)[field];
    const res = await world.api.forensicsClient.packets(payload);
    setState(world, res);
    world.api.log.info({ field, statusCode: res.statusCode }, 'Ingest pachet forensic cu câmp lipsă');
  },
);

When(/^I ingest a malformed forensic packet$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.forensicsClient.packets('not-a-json-object'));
});

When(/^I ingest a forensic packet without an API key$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.forensicsClient.packets(validPacketPayload(), NO_API_KEY));
});

When(/^I ingest a forensic packet with an invalid API key$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.forensicsClient.packets(validPacketPayload(), BAD_API_KEY));
});

Given(
  /^a forensic packet has been ingested for device "([^"]*)"(?: (forensics\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, deviceId: string, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ForensicsContext.DEFAULT_FORENSICS_ALIAS, 'forensics');
    const res = await world.api.forensicsClient.packets(validPacketPayload({ deviceId }));
    world.api.forensicsCtx.setIngest(alias, res);
    world.api.log.info({ alias, deviceId, statusCode: res.statusCode }, 'Precondiție: pachet forensic ingerat');
  },
);

When(/^I list the forensic packets as the operator$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.forensicsClient.list());
});

When(/^I list the forensic packets without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.forensicsClient.list('', NO_AUTH));
});

Then(/^the forensic response contains the stored packet$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiForensicsResponse;
  expect(body.data?.deviceId, `aștept data.deviceId, am: ${JSON.stringify(body)}`).toBeTruthy();
});

Then(/^the forensic response contains a packet collection$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = (world.api.state.body as ApiForensicsListResponse).data;
  expect(Array.isArray(data?.content), `aștept data.content (listă paginată), am: ${JSON.stringify(data)}`).toBe(true);
});
