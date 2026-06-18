import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Given, When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { DeviceContext } from '@support/context/DeviceContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiDeviceResponse } from 'src/schemas/zod/devices';

const NO_API_KEY: HeaderMap = { 'x-api-key': '' };
const BAD_API_KEY: HeaderMap = { 'x-api-key': 'not-a-real-key' };
const NO_AUTH: HeaderMap = { 'x-api-key': '', authorization: '' };
const UNKNOWN_ID = '00000000-0000-0000-0000-000000000000';

function validDevicePayload(overrides: Record<string, unknown> = {}) {
  return {
    name: `router-${faker.string.alphanumeric(8).toLowerCase()}`,
    ipAddress: faker.internet.ipv4(),
    firmware: `${faker.number.int({ min: 19, max: 23 })}.05.${faker.number.int({ min: 0, max: 6 })}`,
    model: faker.helpers.arrayElement(['gl-mt300n', 'archer-c7', 'test-router']),
    ...overrides,
  };
}

function validHeartbeat() {
  return {
    cpuPercent: faker.number.int({ min: 1, max: 95 }),
    memPercent: faker.number.int({ min: 1, max: 95 }),
    seenAt: new Date().toISOString(),
  };
}

function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

function registeredId(world: UnifiedWorld, alias: string): string {
  const body = world.api.deviceCtx.getRegister(alias).apiRes.body as ApiDeviceResponse;
  return body.data?.deviceId ?? 'DeviceIdMissing';
}

Given(
  /^a device has been registered(?: as (device\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    const res = await world.api.devicesClient.register(validDevicePayload());
    world.api.deviceCtx.setRegister(alias, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Precondiție: dispozitiv înregistrat');
  },
);

When(
  /^I register a new device(?: (device\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    const res = await world.api.devicesClient.register(validDevicePayload());
    world.api.deviceCtx.setRegister(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Înregistrare dispozitiv');
  },
);

When(
  /^I register a device with the "([^"]*)" field set to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, field: string, value: string) => {
    const res = await world.api.devicesClient.register(validDevicePayload({ [field]: value }));
    setState(world, res);
    world.api.log.info({ field, value, statusCode: res.statusCode }, 'Înregistrare cu câmp suprascris');
  },
);

When(
  /^I register a device with the "([^"]*)" field omitted$/,
  async ({ world }: { world: UnifiedWorld }, field: string) => {
    const payload = validDevicePayload();
    delete (payload as Record<string, unknown>)[field];
    const res = await world.api.devicesClient.register(payload);
    setState(world, res);
    world.api.log.info({ field, statusCode: res.statusCode }, 'Înregistrare cu câmp lipsă');
  },
);

When(/^I register a device without an API key$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.register(validDevicePayload(), NO_API_KEY));
});

When(/^I register a device with an invalid API key$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.register(validDevicePayload(), BAD_API_KEY));
});

When(
  /^I send a heartbeat for the registered device(?: (device\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.heartbeat(registeredId(world, alias), validHeartbeat()));
  },
);

When(/^I send a heartbeat for an unknown device$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.heartbeat(UNKNOWN_ID, validHeartbeat()));
});

When(
  /^I send a malformed heartbeat for the registered device(?: (device\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.heartbeat(registeredId(world, alias), { cpuPercent: 'high', seenAt: 'not-a-date' }));
  },
);

When(
  /^I send a heartbeat for the registered device(?: (device\d+))? without authentication$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.heartbeat(registeredId(world, alias), validHeartbeat(), NO_AUTH));
  },
);

When(
  /^I request the ruleset for the registered device(?: (device\d+))? using the API key header$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.ruleset(registeredId(world, alias)));
  },
);

When(
  /^I request the ruleset for the registered device(?: (device\d+))? using the API key query parameter$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');

    setState(world, await world.api.devicesClient.rulesetByQuery(registeredId(world, alias), world.api.env.agentApiKey));
  },
);

When(/^I request the ruleset for an unknown device$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.ruleset(UNKNOWN_ID));
});

When(
  /^I request the ruleset for the registered device(?: (device\d+))? without credentials$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.ruleset(registeredId(world, alias), NO_AUTH));
  },
);

When(/^I list the devices as the operator$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.list());
});

When(/^I list the devices without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.list(NO_AUTH));
});

When(
  /^I quarantine the registered device(?: (device\d+))? as the operator$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.quarantine(registeredId(world, alias)));
  },
);

When(
  /^I release the registered device(?: (device\d+))? as the operator$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.release(registeredId(world, alias)));
  },
);

When(/^I quarantine an unknown device as the operator$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.quarantine(UNKNOWN_ID));
});

When(/^I release an unknown device as the operator$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.devicesClient.release(UNKNOWN_ID));
});

When(
  /^I quarantine the registered device(?: (device\d+))? without authentication$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, DeviceContext.DEFAULT_DEVICE_ALIAS, 'device');
    setState(world, await world.api.devicesClient.quarantine(registeredId(world, alias), NO_AUTH));
  },
);

Then(/^the device response contains a device id$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiDeviceResponse;
  expect(body.data?.deviceId, `aștept data.deviceId, am: ${JSON.stringify(body)}`).toBeTruthy();
});

Then(/^the device response contains thresholds$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body as ApiDeviceResponse;
  expect(body.data?.thresholds, 'aștept praguri în ruleset').not.toBeUndefined();
});

Then(/^the device response contains a list of devices$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = (world.api.state.body as { data?: { content?: unknown } }).data;
  const list = Array.isArray(data) ? data : data?.content;
  expect(Array.isArray(list), `aștept o listă de dispozitive (data.content), am: ${JSON.stringify(data)}`).toBe(true);
});

Then(/^the registered device has status "([^"]*)"$/, async ({ world }: { world: UnifiedWorld }, expected: string) => {
  const body = world.api.state.body as ApiDeviceResponse;
  expect(body.data?.status).toBe(expected);
});
