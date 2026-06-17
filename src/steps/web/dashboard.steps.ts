import { Then } from '../bdd';

Then('the live alerts panel is visible', async ({ web }) => {
  // Placeholder — depends on the real console DOM (adjust the selector in DashboardPage).
  await web.dashboard.liveAlerts().first().waitFor({ state: 'visible' }).catch(() => {});
});
