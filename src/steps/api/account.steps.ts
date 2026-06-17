import { Given, When, Then } from '../bdd';
import { totpCode } from '../../utils/auth/totp';
import { AccountClient } from '../../clients/api/AccountClient';

When('operatorul se autentifică cu parola', async ({ api }) => {
  const { username, password } = api.env.operator;
  const res = await api.account.login(username, password);
  api.lastResponse = res;
  const data = (res.body as any)?.data ?? {};
  if (data.token) { api.context.set('token', data.token); api.authenticateOperator(data.token); }
  if (data.mfaToken) api.context.set('mfaToken', data.mfaToken);
});

Then('autentificarea cere al doilea factor', async ({ api }) => {
  const data = (api.lastResponse!.body as any)?.data ?? {};
  if (!data.mfaRequired && !data.mfaToken) throw new Error('aștept o cerere de al doilea factor');
});

When('operatorul trimite codul TOTP', async ({ api }) => {
  const mfaToken = api.context.get<string>('mfaToken');
  const res = await api.account.loginMfa(mfaToken, totpCode(api.env.operator.totpSecret));
  api.lastResponse = res;
  const token = (res.body as any)?.data?.token;
  if (token) { api.context.set('token', token); api.authenticateOperator(token); }
});

Then('operatorul primește un jeton de sesiune', async ({ api }) => {
  if (!api.context.has('token')) throw new Error('lipsește jetonul de sesiune');
});

When('un client neautentificat cere contul', async ({ api, env }) => {
  api.lastResponse = await new AccountClient(env.apiBaseUrl).me();
});

/** Autentificare completă prin API (parolă + eventual TOTP), pentru testele care au nevoie de operator logat. */
Given('operatorul este autentificat prin API', async ({ api }) => {
  const { username, password, totpSecret } = api.env.operator;
  let res = await api.account.login(username, password);
  let data = (res.body as any)?.data ?? {};
  if (data.mfaToken) { res = await api.account.loginMfa(data.mfaToken, totpCode(totpSecret)); data = (res.body as any)?.data ?? {}; }
  if (!data.token) throw new Error('autentificarea operatorului prin API a eșuat');
  api.authenticateOperator(data.token);
});
