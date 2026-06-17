import { Given, When, Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';
import { newTrafficStats } from '../../data/generators/trafficStatsGenerator';
import { isoSecondsAgo, nowIso } from '../../data/generators/timestampGenerator';
import { TrafficClient } from '../../clients/api/TrafficClient';

/**
 * Step definitions for the TRAFFIC domain.
 * Endpoints:
 *  - POST /api/traffic/stats  (agent)    -> 201
 *  - GET  /api/traffic        (operator) -> 200
 *
 * All domain phrases are prefixed with the "traffic" noun so they never
 * collide with steps defined by other domains.
 */

// ---------------------------------------------------------------------------
// POST /api/traffic/stats  (agent ingests a traffic-statistics window)
// ---------------------------------------------------------------------------

/** Ingest a well-formed traffic-statistics window as the edge agent. */
When('the agent submits valid traffic statistics', async ({ api }) => {
  const stats = newTrafficStats();
  api.context.set('trafficStats', stats);
  api.lastResponse = await api.traffic.stats(stats);
});

/** Ingest a traffic-statistics window that is missing a mandatory counter. */
When('the agent submits traffic statistics without the {string} counter', async ({ api }, field: string) => {
  const stats = newTrafficStats() as Record<string, unknown>;
  delete stats[field];
  api.context.set('trafficStats', stats);
  api.lastResponse = await api.traffic.stats(stats);
});

/** Ingest a traffic-statistics window where one counter carries a negative value. */
When('the agent submits traffic statistics with {string} set to {int}', async ({ api }, field: string, value: number) => {
  const stats = newTrafficStats({ [field]: value });
  api.context.set('trafficStats', stats);
  api.lastResponse = await api.traffic.stats(stats);
});

/** Ingest a traffic-statistics window without presenting the agent API key. */
When('an unauthenticated agent submits valid traffic statistics', async ({ api, env }) => {
  const bare = new TrafficClient(env.apiBaseUrl);
  api.lastResponse = await bare.stats(newTrafficStats());
});

// ---------------------------------------------------------------------------
// GET /api/traffic  (operator reads aggregated traffic)
// ---------------------------------------------------------------------------

/** Attach the operator bearer token to the traffic client (operator-only read). */
function asOperator(api: any): TrafficClient {
  const token = api.context.get('operatorToken') as string;
  return (api.traffic as TrafficClient).setAuth({ authorization: `Bearer ${token}` });
}

/** Request the aggregated traffic with default parameters. */
When('the operator requests the traffic overview', async ({ api }) => {
  api.lastResponse = await asOperator(api).list();
});

/** Request the aggregated traffic constrained to a valid time range. */
When('the operator requests the traffic overview for the last {int} seconds', async ({ api }, seconds: number) => {
  const from = encodeURIComponent(isoSecondsAgo(seconds));
  const to = encodeURIComponent(nowIso());
  api.lastResponse = await asOperator(api).list(`?from=${from}&to=${to}`);
});

/** Request the aggregated traffic using a malformed time range. */
When('the operator requests the traffic overview with the time range {string}', async ({ api }, range: string) => {
  api.lastResponse = await asOperator(api).list(range);
});

/** Request the aggregated traffic without any operator authentication. */
When('an unauthenticated operator requests the traffic overview', async ({ api, env }) => {
  const bare = new TrafficClient(env.apiBaseUrl);
  api.lastResponse = await bare.list();
});

// ---------------------------------------------------------------------------
// Domain-specific assertions
// ---------------------------------------------------------------------------

/** The accepted statistics window is echoed back with a server-side id. */
Then('the accepted traffic statistics carry an identifier', async ({ api }) => {
  const data = (api.lastResponse!.body as { data?: { id?: unknown } })?.data ?? {};
  if (data.id === undefined || data.id === null || String(data.id).length === 0) {
    throw new Error('expected the accepted traffic statistics to carry an identifier');
  }
});

/** The traffic overview payload exposes an array of statistics windows. */
Then('the traffic overview contains a list of windows', async ({ api }) => {
  const data = (api.lastResponse!.body as { data?: unknown })?.data;
  const items = Array.isArray(data) ? data : (data as { items?: unknown })?.items;
  if (!Array.isArray(items)) {
    throw new Error('expected the traffic overview to contain a list of windows');
  }
});
