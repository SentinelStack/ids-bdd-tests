import { Given, When, Then } from '../bdd';
import { totpCode } from '../../utils/auth/totp';

Given('operatorul deschide pagina de autentificare', async ({ web }) => {
  await web.login.goto();
});

When('operatorul introduce credențialele', async ({ web }) => {
  await web.login.submitCredentials(web.env.operator.username, web.env.operator.password);
});

When('operatorul introduce codul TOTP', async ({ web }) => {
  await web.login.submitTotp(totpCode(web.env.operator.totpSecret));
});

Then('tabloul de bord este afișat', async ({ web }) => {
  await web.dashboard.expectLoaded();
});
