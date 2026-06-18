import { expect } from '@playwright/test';
import { When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { ReportsContext } from '@support/context/ReportsContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiReportResponse } from 'src/schemas/zod/reports';

const NO_AUTH: HeaderMap = { authorization: '', 'x-api-key': '' };

function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

function firstCuratedName(world: UnifiedWorld, alias: string): string {
  const body = world.api.reportsCtx.getCatalog(alias).apiRes.body as ApiReportResponse;
  const data = (body as { data?: unknown }).data;
  const list = Array.isArray(data)
    ? data
    : ((data as { content?: unknown[]; reports?: unknown[]; items?: unknown[] })?.content
      ?? (data as { reports?: unknown[] })?.reports ?? (data as { items?: unknown[] })?.items ?? []);
  if (!Array.isArray(list) || list.length === 0) throw new Error('aștept cel puțin un raport curat în catalog');
  const first = list[0] as string | { key?: string; name?: string; id?: string };
  const name = typeof first === 'string' ? first : (first?.key ?? first?.name ?? first?.id);
  if (!name) throw new Error('nu pot rezolva un nume de raport curat din catalog');
  return String(name);
}

When(/^the report filter metadata is requested$/, async ({ world }: { world: UnifiedWorld }) => {
  const res = await world.api.reportsClient.meta();
  setState(world, res);
  world.api.log.info({ statusCode: res.statusCode }, 'Cerere metadate filtre rapoarte');
});

When(/^the report filter metadata is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.reportsClient.meta(NO_AUTH));
});

When(/^the alerts report preview is requested$/, async ({ world }: { world: UnifiedWorld }) => {
  const res = await world.api.reportsClient.preview();
  setState(world, res);
  world.api.log.info({ statusCode: res.statusCode }, 'Cerere preview raport alerte');
});

When(/^the alerts report preview is requested with query "([^"]*)"$/, async ({ world }: { world: UnifiedWorld }, query: string) => {
  const res = await world.api.reportsClient.preview(query);
  setState(world, res);
  world.api.log.info({ query, statusCode: res.statusCode }, 'Cerere preview raport alerte cu filtru');
});

When(/^the alerts report preview is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.reportsClient.preview('', NO_AUTH));
});

When(/^the alerts report download is requested in "([^"]*)" format$/, async ({ world }: { world: UnifiedWorld }, format: string) => {
  const res = await world.api.reportsClient.download(`?format=${encodeURIComponent(format)}`);
  setState(world, res);
  world.api.log.info({ format, statusCode: res.statusCode }, 'Descărcare raport alerte');
});

When(/^the alerts report download is requested with query "([^"]*)"$/, async ({ world }: { world: UnifiedWorld }, query: string) => {
  const res = await world.api.reportsClient.download(query);
  setState(world, res);
  world.api.log.info({ query, statusCode: res.statusCode }, 'Descărcare raport alerte cu filtru');
});

When(/^the alerts report download is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.reportsClient.download('', NO_AUTH));
});

When(/^the report volume histogram is requested$/, async ({ world }: { world: UnifiedWorld }) => {
  const res = await world.api.reportsClient.volume();
  setState(world, res);
  world.api.log.info({ statusCode: res.statusCode }, 'Cerere histogramă volum');
});

When(/^the report volume histogram is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.reportsClient.volume('', NO_AUTH));
});

When(
  /^the curated reports catalog is requested(?: as (report\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ReportsContext.DEFAULT_REPORT_ALIAS, 'report');
    const res = await world.api.reportsClient.curated();
    world.api.reportsCtx.setCatalog(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Cerere catalog rapoarte curate');
  },
);

When(/^the curated reports catalog is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.reportsClient.curated(NO_AUTH));
});

When(
  /^the first curated report from the catalog(?: (report\d+))? is downloaded$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, ReportsContext.DEFAULT_REPORT_ALIAS, 'report');
    const name = firstCuratedName(world, alias);
    const res = await world.api.reportsClient.curatedDownload(name);
    setState(world, res);
    world.api.log.info({ alias, name, statusCode: res.statusCode }, 'Descărcare primul raport curat');
  },
);

When(/^the curated report "([^"]*)" is downloaded$/, async ({ world }: { world: UnifiedWorld }, name: string) => {
  const res = await world.api.reportsClient.curatedDownload(name);
  setState(world, res);
  world.api.log.info({ name, statusCode: res.statusCode }, 'Descărcare raport curat după nume');
});

Then(/^the report response data is a list$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = (world.api.state.body as { data?: unknown }).data;
  const list = Array.isArray(data)
    ? data
    : (data as { content?: unknown; rows?: unknown; items?: unknown; reports?: unknown; buckets?: unknown })?.content
      ?? (data as { rows?: unknown })?.rows
      ?? (data as { items?: unknown })?.items
      ?? (data as { reports?: unknown })?.reports
      ?? (data as { buckets?: unknown })?.buckets;
  expect(Array.isArray(list), `aștept ca data raportului să fie (sau să conțină) o listă, am: ${JSON.stringify(data)}`).toBe(true);
});

Then(/^the report response data contains the field "([^"]*)"$/, async ({ world }: { world: UnifiedWorld }, field: string) => {
  const data = (world.api.state.body as { data?: unknown }).data;
  expect(data != null && typeof data === 'object' && field in (data as object), `aștept câmpul "${field}" în data raportului`).toBe(true);
});

Then(/^the report response body is not empty$/, async ({ world }: { world: UnifiedWorld }) => {
  const body = world.api.state.body;
  const text = typeof body === 'string' ? body : JSON.stringify(body ?? '');
  expect(text.trim().length, 'aștept un corp de răspuns ne-gol').toBeGreaterThan(0);
});
