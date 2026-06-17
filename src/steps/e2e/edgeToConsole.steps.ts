import { When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { newAlert } from 'src/data/generators/alertGenerator';
import { pollUntil } from 'src/utils/poll';

When('the agent reports an anomaly', async ({ world }: { world: UnifiedWorld }) => {
  const alert = newAlert({ sourceIp: `198.51.100.${1 + Math.floor(Math.random() * 250)}` });
  world.api.context.set('e2eAlert', alert);
  const res = await world.api.alertsClient.create(alert);
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
});

Then('the alert appears in the console within {int} seconds', async ({ world }: { world: UnifiedWorld }, seconds: number) => {
  const alert = world.api.context.get<{ sourceIp: string }>('e2eAlert');
  const res = await pollUntil(
    () => world.api.alertsClient.list(`?search=${alert.sourceIp}&size=50`),
    (r) => ((r.body as any)?.data?.content ?? []).some((a: any) => a.sourceIp === alert.sourceIp),
    { timeoutMs: seconds * 1000, intervalMs: 1000 },
  );
  const items = (res.body as any)?.data?.content ?? [];
  if (!items.some((a: any) => a.sourceIp === alert.sourceIp)) {
    throw new Error(`alerta de la ${alert.sourceIp} nu a ajuns în consolă în ${seconds}s`);
  }
});
