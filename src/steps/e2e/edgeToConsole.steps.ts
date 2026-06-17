import { When, Then } from '../bdd';
import { newAlert } from '../../data/generators/alertGenerator';
import { pollUntil } from '../../utils/poll';

When('the agent reports an anomaly', async ({ api }) => {
  const alert = newAlert({ sourceIp: `198.51.100.${1 + Math.floor(Math.random() * 250)}` });
  api.context.set('e2eAlert', alert);
  api.lastResponse = await api.alerts.create(alert);
});

Then('the alert appears in the console within {int} seconds', async ({ api }, seconds: number) => {
  const alert = api.context.get<{ sourceIp: string }>('e2eAlert');
  const res = await pollUntil(
    () => api.alerts.list(`?search=${alert.sourceIp}&size=50`),
    (r) => ((r.body as any)?.data?.content ?? []).some((a: any) => a.sourceIp === alert.sourceIp),
    { timeoutMs: seconds * 1000, intervalMs: 1000 },
  );
  const items = (res.body as any)?.data?.content ?? [];
  if (!items.some((a: any) => a.sourceIp === alert.sourceIp)) {
    throw new Error(`alert from ${alert.sourceIp} did not reach the console within ${seconds}s`);
  }
});
