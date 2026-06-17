import { When } from '../bdd';

When('operatorul listează regulile', async ({ api }) => {
  api.lastResponse = await api.rules.list();
});
