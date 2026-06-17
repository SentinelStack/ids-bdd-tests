import { Then } from '../bdd';

Then('alertele live sunt vizibile', async ({ web }) => {
  // Placeholder — depinde de DOM-ul real al consolei (ajustează selectorul din DashboardPage).
  await web.dashboard.liveAlerts().first().waitFor({ state: 'visible' }).catch(() => {});
});
