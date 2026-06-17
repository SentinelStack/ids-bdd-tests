import { Given, When, Then } from '../bdd';
import { AccountClient } from '../../clients/api/AccountClient';
import { totpCode } from '../../utils/auth/totp';

/**
 * ACCOUNT / AUTH domain steps.
 *
 * Phrases here are prefixed with the "operator"/"account"/"auth" nouns so they
 * never collide with other domains. The shared status / success / message
 * assertions live in src/steps/common and are reused, not redefined.
 */

// ----- /api/auth/login -----------------------------------------------------

When('the operator logs in with the seeded credentials', async ({ api }) => {
  const { username, password } = api.env.operator;
  api.lastResponse = await api.account.login(username, password);
});

When('the operator logs in with username {string} and password {string}', async ({ api }, username: string, password: string) => {
  api.lastResponse = await api.account.login(username, password);
});

When('the operator logs in with the body {string}', async ({ api }, body: string) => {
  api.lastResponse = await api.account.loginRaw(parseJsonBody(body));
});

// Some accounts return a token straight away, others a 2FA challenge.
Then('the login response carries a token or a 2FA challenge', async ({ api }) => {
  const data = dataOf(api.lastResponse);
  const ok = typeof data.token === 'string' || (data.mfaRequired === true && typeof data.mfaToken === 'string');
  if (!ok) throw new Error(`expected a token or an mfaRequired challenge, got ${JSON.stringify(data)}`);
});

Then('the login response requires a second factor', async ({ api }) => {
  const data = dataOf(api.lastResponse);
  if (data.mfaRequired !== true || typeof data.mfaToken !== 'string') {
    throw new Error(`expected a 2FA challenge, got ${JSON.stringify(data)}`);
  }
  api.context.set('mfaToken', data.mfaToken);
});

// ----- /api/auth/mfa -------------------------------------------------------

// Start a real login so we have a fresh, valid mfaToken to complete.
Given('the operator has started a login that requires a second factor', async ({ api }) => {
  const { username, password } = api.env.operator;
  const res = await api.account.login(username, password);
  const data = dataOf(res);
  if (data.mfaRequired !== true || typeof data.mfaToken !== 'string') {
    throw new Error('seeded operator did not return a 2FA challenge; ensure 2FA is enabled for this account');
  }
  api.context.set('mfaToken', data.mfaToken);
});

When('the operator completes the second factor with the current TOTP code', async ({ api }) => {
  const mfaToken = api.context.get<string>('mfaToken');
  api.lastResponse = await api.account.loginMfa(mfaToken, totpCode(api.env.operator.totpSecret));
});

When('the operator completes the second factor with code {string}', async ({ api }, code: string) => {
  const mfaToken = api.context.get<string>('mfaToken');
  api.lastResponse = await api.account.loginMfa(mfaToken, code);
});

When('the operator completes the second factor with an invalid challenge token', async ({ api }) => {
  api.lastResponse = await api.account.loginMfa('not-a-real-mfa-token', totpCode(api.env.operator.totpSecret));
});

When('the operator completes the second factor with the body {string}', async ({ api }, body: string) => {
  api.lastResponse = await api.account.loginMfaRaw(parseJsonBody(body));
});

Then('the mfa response carries a token', async ({ api }) => {
  const data = dataOf(api.lastResponse);
  if (typeof data.token !== 'string' || data.token.length === 0) {
    throw new Error(`expected a token in the mfa response, got ${JSON.stringify(data)}`);
  }
});

// ----- /api/auth/google ----------------------------------------------------

When('the operator signs in with Google id token {string}', async ({ api }, idToken: string) => {
  api.lastResponse = await api.account.loginGoogle(idToken);
});

When('the operator signs in with Google using the body {string}', async ({ api }, body: string) => {
  api.lastResponse = await api.account.loginGoogleRaw(parseJsonBody(body));
});

// ----- GET /api/account ----------------------------------------------------

When('the operator account is requested', async ({ api }) => {
  api.lastResponse = await api.account.me();
});

When('the operator account is requested without authentication', async ({ api, env }) => {
  api.lastResponse = await new AccountClient(env.apiBaseUrl).me();
});

Then('the account response carries the username and account id', async ({ api }) => {
  const data = dataOf(api.lastResponse);
  if (typeof data.username !== 'string' || typeof data.accountId !== 'string') {
    throw new Error(`expected username and accountId in the account, got ${JSON.stringify(data)}`);
  }
});

// ----- PUT /api/account/profile -------------------------------------------

When('the operator updates the profile full name to {string}', async ({ api }, fullName: string) => {
  api.lastResponse = await api.account.updateProfile({ fullName });
});

When('the operator updates the profile email to {string}', async ({ api }, email: string) => {
  api.lastResponse = await api.account.updateProfile({ email });
});

When('the operator updates the profile phone to {string}', async ({ api }, phone: string) => {
  api.lastResponse = await api.account.updateProfile({ phone });
});

When('an unauthenticated client updates the profile email to {string}', async ({ api, env }, email: string) => {
  api.lastResponse = await new AccountClient(env.apiBaseUrl).updateProfile({ email });
});

// ----- POST /api/account/password -----------------------------------------

When('the operator changes the password from {string} to {string}', async ({ api }, current: string, next: string) => {
  api.lastResponse = await api.account.changePassword(current, next);
});

When('an unauthenticated client changes the password from {string} to {string}', async ({ api, env }, current: string, next: string) => {
  api.lastResponse = await new AccountClient(env.apiBaseUrl).changePassword(current, next);
});

// Positive round-trip: change the seeded password to a new strong value, assert
// success, then change it back so the operator stays usable for other scenarios.
When('the operator rotates the password and restores it', async ({ api }) => {
  const original = api.env.operator.password;
  const rotated = `${original}x9`;
  const first = await api.account.changePassword(original, rotated);
  api.lastResponse = first;
  if (first.status === 200) {
    await api.account.changePassword(rotated, original);
  }
});

// ----- helpers -------------------------------------------------------------

function dataOf(res: { body: unknown } | undefined): Record<string, any> {
  return ((res?.body as any)?.data ?? {}) as Record<string, any>;
}

// Lets a feature express raw / malformed JSON bodies (missing fields, empty object).
function parseJsonBody(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`feature provided an invalid JSON body: ${body}`);
  }
}
