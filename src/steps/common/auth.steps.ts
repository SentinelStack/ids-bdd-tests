import { Given } from '../bdd';
import { totpCode } from '../../utils/auth/totp';

/** Authenticate the operator via API (password, then TOTP if required) for operator-only endpoints. */
Given('the operator is authenticated via API', async ({ api }) => {
  const { username, password, totpSecret } = api.env.operator;
  let res = await api.account.login(username, password);
  let data = (res.body as any)?.data ?? {};
  if (data.mfaToken) {
    res = await api.account.loginMfa(data.mfaToken, totpCode(totpSecret));
    data = (res.body as any)?.data ?? {};
  }
  if (!data.token) throw new Error('operator API authentication failed');
  api.authenticateOperator(data.token);
});
