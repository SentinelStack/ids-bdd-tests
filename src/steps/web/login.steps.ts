import { Given, When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { totpCode } from 'src/utils/auth/totp';

Given('the operator opens the login page', async ({ world }: { world: UnifiedWorld }) => {
  await world.web.login.goto();
});
When('the operator submits valid credentials', async ({ world }: { world: UnifiedWorld }) => {
  await world.web.login.submitCredentials(world.env.operator.username, world.env.operator.password);
});
When('the operator submits invalid credentials', async ({ world }: { world: UnifiedWorld }) => {
  await world.web.login.submitCredentials(world.env.operator.username, 'wrong-password');
});
When('the operator submits the TOTP code', async ({ world }: { world: UnifiedWorld }) => {
  await world.web.login.submitTotp(totpCode(world.env.operator.totpSecret));
});
Then('the dashboard is displayed', async ({ world }: { world: UnifiedWorld }) => {
  await world.web.dashboard.expectLoaded();
});
