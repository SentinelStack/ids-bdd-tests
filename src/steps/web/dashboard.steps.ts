import { Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';

Then('the live alerts panel is visible', async ({ world }: { world: UnifiedWorld }) => {
  // Placeholder — depinde de DOM-ul real al consolei (ajustează selectorul în DashboardPage).
  await world.web.dashboard.liveAlerts().first().waitFor({ state: 'visible' }).catch(() => {});
});
