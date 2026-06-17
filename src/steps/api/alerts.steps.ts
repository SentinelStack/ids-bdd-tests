import { Given, When, Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';
import { newAlert } from '../../data/generators/alertGenerator';
import { AlertsClient } from '../../clients/api/AlertsClient';

/**
 * Domain ALERTS steps.
 * Endpoints exercised:
 *   - POST /api/alerts                          (agent ingest)
 *   - GET  /api/alerts                          (operator list / filter / paginate)
 *   - POST /api/alerts/{alertId}/acknowledge    (operator acknowledge)
 *
 * Phrases are prefixed with the "alert" noun so they never collide with other domains.
 */

// ---------------------------------------------------------------------------
// Ingestion (agent) — POST /api/alerts
// ---------------------------------------------------------------------------

/** Build a valid alert body and stash it in the context for later assertions/overrides. */
Given('an alert payload is prepared', async ({ api }) => {
  api.context.set('alertBody', newAlert());
});

/** Replace one field of the prepared alert body with an explicit value. */
Given('the alert field {string} is set to {string}', async ({ api }, field: string, value: string) => {
  const body = api.context.get<Record<string, unknown>>('alertBody');
  body[field] = value;
  api.context.set('alertBody', body);
});

/** Remove a required field from the prepared alert body (drives 400 negatives). */
Given('the alert field {string} is omitted', async ({ api }, field: string) => {
  const body = api.context.get<Record<string, unknown>>('alertBody');
  delete body[field];
  api.context.set('alertBody', body);
});

/** Agent ingests the currently prepared alert payload. */
When('the agent ingests the prepared alert', async ({ api }) => {
  const body = api.context.get<Record<string, unknown>>('alertBody');
  api.lastResponse = await api.alerts.create(body);
  const data = (api.lastResponse.body as any)?.data ?? {};
  if (data.alertId) api.context.set('ingestedAlertId', data.alertId);
});

/** Agent ingests a fresh, fully valid alert (convenience for chaining prerequisites). */
When('the agent ingests a new alert', async ({ api }) => {
  api.lastResponse = await api.alerts.create(newAlert());
  const data = (api.lastResponse.body as any)?.data ?? {};
  if (data.alertId) api.context.set('ingestedAlertId', data.alertId);
});

/** Agent ingests an alert carrying a distinctive marker so it can be found via filters/search. */
When(
  'the agent ingests an alert with severity {string} protocol {string} source ip {string}',
  async ({ api }, severity: string, protocol: string, sourceIp: string) => {
    api.lastResponse = await api.alerts.create(newAlert({ severity, protocol, sourceIp }));
    const data = (api.lastResponse.body as any)?.data ?? {};
    if (data.alertId) api.context.set('ingestedAlertId', data.alertId);
  },
);

/** Attempt to ingest an alert WITHOUT any authentication (bare client, no api key). */
When('an unauthenticated agent ingests a valid alert', async ({ api, env }) => {
  const bare = new AlertsClient(env.apiBaseUrl);
  api.lastResponse = await bare.create(newAlert());
});

// ---------------------------------------------------------------------------
// Listing / filtering (operator) — GET /api/alerts
// ---------------------------------------------------------------------------

/** Operator requests the default (unfiltered) alert list. */
When('the operator requests the alert list', async ({ api }) => {
  api.lastResponse = await api.alerts.list();
});

/** Operator requests the alert list with a raw query string (filters, sort, pagination, search). */
When('the operator requests the alert list with query {string}', async ({ api }, query: string) => {
  api.lastResponse = await api.alerts.list(query);
});

/** Attempt to list alerts WITHOUT authentication (bare operator-less client). */
When('an unauthenticated operator requests the alert list', async ({ api, env }) => {
  const bare = new AlertsClient(env.apiBaseUrl);
  api.lastResponse = await bare.list();
});

// ---------------------------------------------------------------------------
// Acknowledge (operator) — POST /api/alerts/{alertId}/acknowledge
// ---------------------------------------------------------------------------

/** Operator acknowledges the alert that was ingested earlier in this scenario. */
When('the operator acknowledges the ingested alert', async ({ api }) => {
  const alertId = api.context.get<string>('ingestedAlertId');
  api.lastResponse = await api.alerts.acknowledge(alertId);
});

/** Operator acknowledges an alert id that does not exist (drives 404). */
When('the operator acknowledges the alert id {string}', async ({ api }, alertId: string) => {
  api.lastResponse = await api.alerts.acknowledge(alertId);
});

/** Attempt to acknowledge an alert WITHOUT authentication. */
When('an unauthenticated operator acknowledges the alert id {string}', async ({ api, env }, alertId: string) => {
  const bare = new AlertsClient(env.apiBaseUrl);
  api.lastResponse = await bare.acknowledge(alertId);
});

// ---------------------------------------------------------------------------
// Domain-specific assertions
// ---------------------------------------------------------------------------

/** The ingest response should echo back a generated alert id. */
Then('the response contains an alert id', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data ?? {};
  if (!data.alertId) throw new Error(`expected an alertId in the response data, got ${api.lastResponse!.raw}`);
});

/** The list response should be a paged envelope exposing data.content as an array. */
Then('the alert list response is paged', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data ?? {};
  if (!Array.isArray(data.content)) {
    throw new Error(`expected a paged envelope with data.content array, got ${api.lastResponse!.raw}`);
  }
});

/** Every returned alert in the page should match the given field/value (filter correctness). */
Then('every listed alert has {string} equal to {string}', async ({ api }, field: string, value: string) => {
  const content = ((api.lastResponse!.body as any)?.data?.content ?? []) as Array<Record<string, unknown>>;
  if (content.length === 0) throw new Error('expected at least one alert in the filtered page');
  const offenders = content.filter((a) => String(a[field]) !== value);
  if (offenders.length > 0) {
    throw new Error(`expected every alert's ${field} to equal "${value}", found ${offenders.length} mismatch(es)`);
  }
});

/** The page should not exceed the requested page size. */
Then('the alert page holds at most {int} item(s)', async ({ api }, size: number) => {
  const content = ((api.lastResponse!.body as any)?.data?.content ?? []) as unknown[];
  if (content.length > size) {
    throw new Error(`expected at most ${size} alerts on the page, got ${content.length}`);
  }
});

/** Reuse expectStatus indirectly so the import is meaningful even if a feature asserts inline. */
Then('the alert response status equals {int}', async ({ api }, status: number) => {
  expectStatus(api.lastResponse!, status);
});
