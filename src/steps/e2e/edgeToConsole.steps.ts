import { When, Then } from '../bdd';
import { newAlert } from '../../data/generators/alertGenerator';
import { pollUntil } from '../../utils/poll';

When('agentul raportează o anomalie', async ({ api }) => {
  const alert = newAlert({ sourceIp: `198.51.100.${1 + Math.floor(Math.random() * 250)}` });
  api.context.set('alert', alert);
  api.lastResponse = await api.alerts.create(alert);
});

Then('alerta apare în consolă în cel mult {int} secunde', async ({ api }, seconds: number) => {
  const alert = api.context.get<{ sourceIp: string }>('alert');
  const res = await pollUntil(
    () => api.alerts.list(`?search=${alert.sourceIp}&size=50`),
    (r) => ((r.body as any)?.data?.content ?? []).some((a: any) => a.sourceIp === alert.sourceIp),
    { timeoutMs: seconds * 1000, intervalMs: 1000 },
  );
  const items = (res.body as any)?.data?.content ?? [];
  if (!items.some((a: any) => a.sourceIp === alert.sourceIp)) {
    throw new Error(`alerta (sursa ${alert.sourceIp}) nu a apărut în consolă în ${seconds}s`);
  }
});
