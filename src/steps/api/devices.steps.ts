import { Given, When, Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';
import { newDevice, newHeartbeat } from '../../data/generators/deviceGenerator';
import { DevicesClient } from '../../clients/api/DevicesClient';

/**
 * DEVICES domain steps.
 * Step phrases are prefixed with the "device" noun so they never collide with other domains.
 * Operator-only endpoints (list / quarantine / release) require the operator Bearer; the
 * common Background step "the operator is authenticated via API" stores it under
 * context key 'operatorToken', so we attach it to the devices client on demand.
 */

const CONTEXT = {
  deviceId: 'device.deviceId',
  registerBody: 'device.registerBody',
  apiKey: 'device.apiKey',
};

/** Attach the operator Bearer (set by the auth Background) to the devices client. */
function authorizeDevicesAsOperator(api: any): void {
  const token = api.context.get('operatorToken') as string;
  api.devices.setAuth({ authorization: `Bearer ${token}` });
}

/** Build a fresh, valid registration body and remember it for later assertions/overrides. */
Given('a valid device registration payload', async ({ api }) => {
  api.context.set(CONTEXT.registerBody, newDevice());
});

/** Override a single field of the pending registration payload (use "" for blank/removed). */
Given('the device registration field {string} is set to {string}', async ({ api }, field: string, value: string) => {
  const body = { ...(api.context.get(CONTEXT.registerBody) as Record<string, unknown>) };
  body[field] = value;
  api.context.set(CONTEXT.registerBody, body);
});

/** Remove a mandatory field entirely from the pending registration payload. */
Given('the device registration field {string} is removed', async ({ api }, field: string) => {
  const body = { ...(api.context.get(CONTEXT.registerBody) as Record<string, unknown>) };
  delete body[field];
  api.context.set(CONTEXT.registerBody, body);
});

/** Register a brand-new device (agent X-API-Key) and capture the new deviceId. */
Given('a device is registered', async ({ api }) => {
  api.lastResponse = await api.devices.register(newDevice());
  const id = (api.lastResponse.body as any)?.data?.deviceId;
  if (!id) throw new Error('device registration did not return a deviceId');
  api.context.set(CONTEXT.deviceId, String(id));
});

/** Send the currently prepared registration payload (agent X-API-Key). */
When('the device registration is submitted', async ({ api }) => {
  api.lastResponse = await api.devices.register(api.context.get(CONTEXT.registerBody));
});

/** Send a registration payload without any API key (unauthenticated bare client). */
When('the device registration is submitted without an API key', async ({ api, env }) => {
  const bare = new DevicesClient(env.apiBaseUrl);
  api.lastResponse = await bare.register(newDevice());
});

/** Send a registration payload with an invalid API key (bare client + bad key). */
When('the device registration is submitted with an invalid API key', async ({ api, env }) => {
  const bad = new DevicesClient(env.apiBaseUrl, { 'x-api-key': 'not-a-real-key' });
  api.lastResponse = await bad.register(newDevice());
});

/** Send a valid heartbeat for the previously registered device. */
When('a heartbeat is sent for the registered device', async ({ api }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  api.lastResponse = await api.devices.heartbeat(id, newHeartbeat());
});

/** Send a heartbeat for a device id that does not exist. */
When('a heartbeat is sent for an unknown device', async ({ api }) => {
  api.lastResponse = await api.devices.heartbeat('00000000-0000-0000-0000-000000000000', newHeartbeat());
});

/** Send a malformed heartbeat body (not the expected metric shape). */
When('a malformed heartbeat is sent for the registered device', async ({ api }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  api.lastResponse = await api.devices.heartbeat(id, { cpuPercent: 'high', seenAt: 'not-a-date' });
});

/** Send a heartbeat with no credentials (bare client). */
When('a heartbeat is sent for the registered device without authentication', async ({ api, env }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  const bare = new DevicesClient(env.apiBaseUrl);
  api.lastResponse = await bare.heartbeat(id, newHeartbeat());
});

/** Request the ruleset for the registered device using the agent API key header. */
When('the device ruleset is requested with the API key header', async ({ api }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  api.lastResponse = await api.devices.ruleset(id);
});

/** Request the ruleset for the registered device using the ?apiKey= query parameter. */
When('the device ruleset is requested with the API key query parameter', async ({ api, env }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  const bare = new DevicesClient(env.apiBaseUrl);
  api.lastResponse = await bare.rulesetByQuery(id, env.agentApiKey);
});

/** Request the ruleset for an unknown device (agent API key header present). */
When('the device ruleset is requested for an unknown device', async ({ api }) => {
  api.lastResponse = await api.devices.ruleset('00000000-0000-0000-0000-000000000000');
});

/** Request the ruleset with no credentials at all (bare client, no key, no token). */
When('the device ruleset is requested without credentials', async ({ api, env }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  const bare = new DevicesClient(env.apiBaseUrl);
  api.lastResponse = await bare.ruleset(id);
});

/** List all devices as the authenticated operator. */
When('the device list is requested by the operator', async ({ api }) => {
  authorizeDevicesAsOperator(api);
  api.lastResponse = await api.devices.list();
});

/** List all devices with no credentials (bare client). */
When('the device list is requested without authentication', async ({ api, env }) => {
  const bare = new DevicesClient(env.apiBaseUrl);
  api.lastResponse = await bare.list();
});

/** Quarantine the registered device as the authenticated operator. */
When('the registered device is quarantined by the operator', async ({ api }) => {
  authorizeDevicesAsOperator(api);
  const id = api.context.get(CONTEXT.deviceId) as string;
  api.lastResponse = await api.devices.quarantine(id);
});

/** Release the registered device as the authenticated operator. */
When('the registered device is released by the operator', async ({ api }) => {
  authorizeDevicesAsOperator(api);
  const id = api.context.get(CONTEXT.deviceId) as string;
  api.lastResponse = await api.devices.release(id);
});

/** Quarantine an unknown device as the authenticated operator. */
When('an unknown device is quarantined by the operator', async ({ api }) => {
  authorizeDevicesAsOperator(api);
  api.lastResponse = await api.devices.quarantine('00000000-0000-0000-0000-000000000000');
});

/** Release an unknown device as the authenticated operator. */
When('an unknown device is released by the operator', async ({ api }) => {
  authorizeDevicesAsOperator(api);
  api.lastResponse = await api.devices.release('00000000-0000-0000-0000-000000000000');
});

/** Quarantine the registered device with no credentials (bare client). */
When('the registered device is quarantined without authentication', async ({ api, env }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  const bare = new DevicesClient(env.apiBaseUrl);
  api.lastResponse = await bare.quarantine(id);
});

/** Release the registered device with no credentials (bare client). */
When('the registered device is released without authentication', async ({ api, env }) => {
  const id = api.context.get(CONTEXT.deviceId) as string;
  const bare = new DevicesClient(env.apiBaseUrl);
  api.lastResponse = await bare.release(id);
});

/** Assert that the registration response carried a non-empty deviceId. */
Then('the response contains a device id', async ({ api }) => {
  const id = (api.lastResponse!.body as any)?.data?.deviceId;
  if (!id) throw new Error(`expected data.deviceId in response, got: ${api.lastResponse!.raw}`);
});

/** Assert the ruleset response exposes the threshold configuration. */
Then('the response contains device thresholds', async ({ api }) => {
  const thresholds = (api.lastResponse!.body as any)?.data?.thresholds;
  if (thresholds === undefined || thresholds === null) {
    throw new Error(`expected data.thresholds in ruleset response, got: ${api.lastResponse!.raw}`);
  }
});

/** Assert the response payload is an array of devices. */
Then('the response contains a list of devices', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data;
  if (!Array.isArray(data)) {
    throw new Error(`expected data to be an array of devices, got: ${api.lastResponse!.raw}`);
  }
});

/** Assert the device status field equals the given value (e.g. QUARANTINED / ONLINE). */
Then('the device status is {string}', async ({ api }, expected: string) => {
  const status = (api.lastResponse!.body as any)?.data?.status;
  if (String(status) !== expected) {
    throw new Error(`expected device status "${expected}", got "${status}"`);
  }
});

/** Local convenience assertion identical in spirit to the common one, kept device-scoped. */
Then('the device endpoint responds with status {int}', async ({ api }, status: number) => {
  expectStatus(api.lastResponse!, status);
});
