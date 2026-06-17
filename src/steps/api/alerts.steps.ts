import { When, Then } from '../bdd';
import { AlertsClient } from '../../clients/api/AlertsClient';
import { validateAlertCollection } from '../../validators/api/alertResponseValidators';

When('operatorul listează alertele', async ({ api }) => {
  api.lastResponse = await api.alerts.list('?size=20&sortBy=timestamp&direction=desc');
});

When('operatorul filtrează alertele după severitatea {string}', async ({ api }, severity: string) => {
  api.lastResponse = await api.alerts.list(`?severity=${severity}`);
});

When('un client neautentificat listează alertele', async ({ api, env }) => {
  api.lastResponse = await new AlertsClient(env.apiBaseUrl).list();
});

Then('alertele respectă schema', async ({ api }) => {
  validateAlertCollection(api.lastResponse! as any);
});
