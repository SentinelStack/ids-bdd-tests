import { When, Then } from '../bdd';
import { ConsoleClient } from '../../clients/api/ConsoleClient';

/**
 * Console domain steps (server-side, pre-computed views for the operator).
 * Phrases are prefixed with the "console" noun so they never collide with other domains.
 */

// --- GET /api (public hypermedia index) -------------------------------------

When('the console hypermedia index is requested', async ({ api }) => {
  api.lastResponse = await api.console.index();
});

When('the console hypermedia index is requested without authentication', async ({ api, env }) => {
  api.lastResponse = await new ConsoleClient(env.apiBaseUrl).index();
});

Then('the console index exposes navigation links', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data ?? api.lastResponse!.body;
  const links = (data as any)?.links ?? (data as any)?._links;
  if (!links || (Array.isArray(links) ? links.length === 0 : Object.keys(links).length === 0)) {
    throw new Error('expected the console index to expose navigation links');
  }
});

// --- GET /api/console/dashboard (operator) ----------------------------------

When('the console dashboard is requested', async ({ api }) => {
  api.lastResponse = await api.console.dashboard();
});

When('the console dashboard is requested without authentication', async ({ api, env }) => {
  api.lastResponse = await new ConsoleClient(env.apiBaseUrl).dashboard();
});

Then('the console dashboard payload is present', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data;
  if (data === undefined || data === null) {
    throw new Error('expected the console dashboard to return a data payload');
  }
});

// --- GET /api/console/incidents (operator, filters) -------------------------

When('the console incidents view is requested', async ({ api }) => {
  api.lastResponse = await api.console.incidents();
});

When('the console incidents view is requested filtered by status {string}', async ({ api }, status: string) => {
  api.lastResponse = await api.console.incidents(`?status=${encodeURIComponent(status)}`);
});

When(
  'the console incidents view is requested filtered by severity {string}',
  async ({ api }, severity: string) => {
    api.lastResponse = await api.console.incidents(`?severity=${encodeURIComponent(severity)}`);
  },
);

When('the console incidents view is requested without authentication', async ({ api, env }) => {
  api.lastResponse = await new ConsoleClient(env.apiBaseUrl).incidents();
});
