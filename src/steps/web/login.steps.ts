import { Given, When, Then } from '../bdd';
import { totpCode } from '../../utils/auth/totp';

Given('the operator opens the login page', async ({ web }) => {
  await web.login.goto();
});
When('the operator submits valid credentials', async ({ web }) => {
  await web.login.submitCredentials(web.env.operator.username, web.env.operator.password);
});
When('the operator submits invalid credentials', async ({ web }) => {
  await web.login.submitCredentials(web.env.operator.username, 'wrong-password');
});
When('the operator submits the TOTP code', async ({ web }) => {
  await web.login.submitTotp(totpCode(web.env.operator.totpSecret));
});
Then('the dashboard is displayed', async ({ web }) => {
  await web.dashboard.expectLoaded();
});
