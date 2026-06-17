import { When } from '../bdd';

When('operatorul cere metadatele de export', async ({ api }) => {
  api.lastResponse = await api.reports.meta();
});
