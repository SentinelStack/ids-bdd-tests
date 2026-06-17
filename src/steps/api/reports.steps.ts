import { Given, When, Then } from '../bdd';
import { expectStatus } from '../../utils/api/assertionUtils';

/**
 * Steps for the REPORTS domain (/api/reports, operator).
 * All phrases are prefixed with the "report"/"reports" noun so they never
 * collide with other domains. The four common phrases
 * ("the response status is {int}", "the response indicates success",
 * "the response message contains {string}", "the operator is authenticated via API")
 * are defined elsewhere and only reused in the features.
 */

// ----- Filter metadata -------------------------------------------------------

When('the report filter metadata is requested', async ({ api }) => {
  api.lastResponse = await api.reports.meta();
});

// ----- Alerts preview --------------------------------------------------------

When('the alerts report preview is requested', async ({ api }) => {
  api.lastResponse = await api.reports.preview();
});

When('the alerts report preview is requested with query {string}', async ({ api }, query: string) => {
  api.lastResponse = await api.reports.preview(query);
});

// ----- Alerts download -------------------------------------------------------

When('the alerts report download is requested', async ({ api }) => {
  api.lastResponse = await api.reports.download();
});

When('the alerts report download is requested in {string} format', async ({ api }, format: string) => {
  api.lastResponse = await api.reports.download(`?format=${encodeURIComponent(format)}`);
});

When('the alerts report download is requested with query {string}', async ({ api }, query: string) => {
  api.lastResponse = await api.reports.download(query);
});

// ----- Volume histogram ------------------------------------------------------

When('the report volume histogram is requested', async ({ api }) => {
  api.lastResponse = await api.reports.volume();
});

// ----- Curated catalog + curated download ------------------------------------

When('the curated reports catalog is requested', async ({ api }) => {
  api.lastResponse = await api.reports.curated();
});

When('the first curated report name is remembered', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data;
  const list: any[] = Array.isArray(data) ? data : (data?.reports ?? data?.items ?? []);
  if (!list.length) throw new Error('expected at least one curated report in the catalog');
  const first = list[0];
  const name = typeof first === 'string' ? first : (first?.name ?? first?.id);
  if (!name) throw new Error('could not resolve a curated report name from the catalog');
  api.context.set('curatedReportName', String(name));
});

When('the remembered curated report is downloaded', async ({ api }) => {
  const name = api.context.get<string>('curatedReportName');
  api.lastResponse = await api.reports.curatedDownload(name);
});

When('the curated report {string} is downloaded', async ({ api }, name: string) => {
  api.lastResponse = await api.reports.curatedDownload(name);
});

// ----- Assertions specific to reports ---------------------------------------

Then('the report response carries a file attachment', async ({ api }) => {
  const res = api.lastResponse!;
  expectStatus(res, 200);
  const disposition = res.headers.get('content-disposition') ?? '';
  if (!disposition.toLowerCase().includes('attachment')) {
    throw new Error(`expected a Content-Disposition attachment header, got "${disposition}"`);
  }
});

Then('the report attachment filename contains {string}', async ({ api }, fragment: string) => {
  const disposition = api.lastResponse!.headers.get('content-disposition') ?? '';
  if (!disposition.toLowerCase().includes(fragment.toLowerCase())) {
    throw new Error(`expected Content-Disposition "${disposition}" to contain "${fragment}"`);
  }
});

Then('the report response content type contains {string}', async ({ api }, fragment: string) => {
  const contentType = api.lastResponse!.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes(fragment.toLowerCase())) {
    throw new Error(`expected Content-Type "${contentType}" to contain "${fragment}"`);
  }
});

Then('the report response body is not empty', async ({ api }) => {
  if (!api.lastResponse!.raw || api.lastResponse!.raw.trim().length === 0) {
    throw new Error('expected a non-empty report response body');
  }
});

Then('the report response data is a list', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data;
  const list = Array.isArray(data) ? data : (data?.rows ?? data?.items ?? data?.reports ?? data?.buckets);
  if (!Array.isArray(list)) {
    throw new Error('expected the report response data to be (or contain) a list');
  }
});

Then('the report response data contains the field {string}', async ({ api }, field: string) => {
  const data = (api.lastResponse!.body as any)?.data;
  if (data == null || typeof data !== 'object' || !(field in data)) {
    throw new Error(`expected the report response data to contain field "${field}"`);
  }
});
