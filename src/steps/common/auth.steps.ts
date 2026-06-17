import { Given } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { totpCode } from 'src/utils/auth/totp';

Given('the operator is authenticated via API', async ({ world }: { world: UnifiedWorld }) => {
  const api = world.api;
  const { username, password, totpSecret } = api.env.operator;
  let res = await api.accountClient.login(username, password);
  let data = (res.body as any)?.data ?? {};
  if (data.mfaToken) {
    res = await api.accountClient.loginMfa(data.mfaToken, totpCode(totpSecret));
    data = (res.body as any)?.data ?? {};
  }
  if (!data.token) throw new Error('autentificarea operatorului prin API a eșuat');
  api.authenticateOperator(data.token);
});
