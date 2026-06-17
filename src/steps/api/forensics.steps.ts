import { Given, When, Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';
import { newPacketSummary } from '../../data/generators/packetSummaryGenerator';
import { ForensicsClient } from '../../clients/api/ForensicsClient';

/**
 * FORENSICS domain steps.
 * Endpoints:
 *  - POST /api/forensics/packets (agent)   -> 201 packet metadata ingest
 *  - GET  /api/forensics        (operator) -> 200 list / filter by device
 * All step phrases are prefixed with the "forensic" noun so they never collide
 * with other domains' steps.
 */

// --- POST /api/forensics/packets (agent ingest) ---

Given('a captured forensic packet for device {string}', async ({ api }, deviceId: string) => {
  api.context.set('forensicPacket', newPacketSummary({ deviceId }));
  api.context.set('forensicDeviceId', deviceId);
});

Given('a captured forensic packet', async ({ api }) => {
  const packet = newPacketSummary();
  api.context.set('forensicPacket', packet);
  api.context.set('forensicDeviceId', packet.deviceId);
});

Given('the forensic packet is missing the {string} field', async ({ api }, field: string) => {
  const packet = { ...api.context.get<Record<string, unknown>>('forensicPacket') };
  delete packet[field];
  api.context.set('forensicPacket', packet);
});

When('the forensic packet is ingested by the agent', async ({ api }) => {
  api.lastResponse = await api.forensics.packets(api.context.get('forensicPacket'));
});

When('a malformed forensic packet {string} is ingested by the agent', async ({ api }, payload: string) => {
  api.lastResponse = await api.forensics.packets(payload);
});

When('the forensic packet is ingested without authentication', async ({ api, env }) => {
  const bare = new ForensicsClient(env.apiBaseUrl);
  api.lastResponse = await bare.packets(api.context.get('forensicPacket'));
});

// --- GET /api/forensics (operator list/filter) ---

Given('a forensic packet for device {string} has been ingested', async ({ api }, deviceId: string) => {
  const packet = newPacketSummary({ deviceId });
  const res = await api.forensics.packets(packet);
  expectStatus(res, 201);
  api.context.set('forensicDeviceId', deviceId);
});

When('the forensic packet list is requested', async ({ api }) => {
  api.lastResponse = await api.forensics.list();
});

When('the forensic packet list is requested for device {string}', async ({ api }, deviceId: string) => {
  api.lastResponse = await api.forensics.list(`?deviceId=${encodeURIComponent(deviceId)}`);
});

When('the forensic packet list is requested without authentication', async ({ api, env }) => {
  const bare = new ForensicsClient(env.apiBaseUrl);
  api.lastResponse = await bare.list();
});

When(
  'the forensic packet list is requested for device {string} without authentication',
  async ({ api, env }, deviceId: string) => {
    const bare = new ForensicsClient(env.apiBaseUrl);
    api.lastResponse = await bare.list(`?deviceId=${encodeURIComponent(deviceId)}`);
  },
);

// --- Assertions specific to forensics ---

Then('the forensic response returns a packet collection', async ({ api }) => {
  const data = (api.lastResponse!.body as { data?: unknown })?.data;
  if (!Array.isArray(data)) {
    throw new Error(`expected forensic data to be an array, got ${JSON.stringify(data)}`);
  }
});

Then('every forensic packet in the response belongs to device {string}', async ({ api }, deviceId: string) => {
  const data = (api.lastResponse!.body as { data?: Array<{ deviceId?: string }> })?.data ?? [];
  const mismatch = data.find((p) => p.deviceId !== deviceId);
  if (mismatch) {
    throw new Error(`found forensic packet not belonging to device "${deviceId}": ${JSON.stringify(mismatch)}`);
  }
});
