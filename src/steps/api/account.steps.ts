import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Given, When, Then } from 'src/steps/bdd';
import { UnifiedWorld } from '@support/worlds/UnifiedWorld';
import { AccountContext } from '@support/context/AccountContext';
import { normalizeAlias } from 'src/utils/context/contextUtils';
import { HttpResponse } from 'src/clients/http';
import { HeaderMap } from 'src/clients/BaseClient';
import { ApiAccountResponse } from 'src/schemas/zod/account';
import { totpCode } from 'src/utils/auth/totp';

const NO_AUTH: HeaderMap = { 'x-api-key': '', authorization: '' };

function setState(world: UnifiedWorld, res: HttpResponse): void {
  world.api.state.statusCode = res.statusCode;
  world.api.state.body = res.body;
}

function accountData(world: UnifiedWorld): NonNullable<ApiAccountResponse['data']> {
  return ((world.api.state.body as ApiAccountResponse).data ?? {}) as NonNullable<ApiAccountResponse['data']>;
}

function challengeToken(world: UnifiedWorld, alias: string): string {
  const body = world.api.accountCtx.getLogin(alias).apiRes.body as ApiAccountResponse;
  return body.data?.mfaToken ?? 'MfaTokenMissing';
}

function parseJsonBody(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(`feature provided an invalid JSON body: ${body}`);
  }
}

When(
  /^the operator logs in with the seeded credentials(?: as (account\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, AccountContext.DEFAULT_ACCOUNT_ALIAS, 'account');
    const { username, password } = world.api.env.operator;
    const res = await world.api.accountClient.login(username, password);
    world.api.accountCtx.setLogin(alias, res);
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Autentificare operator (seed)');
  },
);

When(
  /^the operator logs in with username "([^"]*)" and password "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, username: string, password: string) => {
    setState(world, await world.api.accountClient.login(username, password));
  },
);

When(
  /^the operator logs in with the body '([^']*)'$/,
  async ({ world }: { world: UnifiedWorld }, body: string) => {
    setState(world, await world.api.accountClient.loginRaw(parseJsonBody(body)));
  },
);

Then(/^the login response carries a token or a 2FA challenge$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = accountData(world);
  const ok = typeof data.token === 'string' || (data.mfaRequired === true && typeof data.mfaToken === 'string');
  expect(ok, `aștept un token sau o provocare mfaRequired, am: ${JSON.stringify(data)}`).toBe(true);
});

Then(/^the login response requires a second factor$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = accountData(world);
  expect(data.mfaRequired, `aștept o provocare 2FA, am: ${JSON.stringify(data)}`).toBe(true);
  expect(typeof data.mfaToken).toBe('string');
});

Given(
  /^the operator has started a login that requires a second factor(?: as (account\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, AccountContext.DEFAULT_ACCOUNT_ALIAS, 'account');
    const { username, password } = world.api.env.operator;
    const res = await world.api.accountClient.login(username, password);
    const data = (res.body as ApiAccountResponse).data ?? {};
    if (data.mfaRequired !== true || typeof data.mfaToken !== 'string') {
      throw new Error('operatorul seed nu a întors o provocare 2FA; asigură-te că 2FA e activat pentru cont');
    }
    world.api.accountCtx.setLogin(alias, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Precondiție: login cu provocare 2FA');
  },
);

When(
  /^the operator completes the second factor with the current TOTP code(?: for (account\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, AccountContext.DEFAULT_ACCOUNT_ALIAS, 'account');
    const res = await world.api.accountClient.loginMfa(challengeToken(world, alias), totpCode(world.api.env.operator.totpSecret));
    setState(world, res);
    world.api.log.info({ alias, statusCode: res.statusCode }, 'Finalizare 2FA (cod TOTP curent)');
  },
);

When(
  /^the operator completes the second factor with code "([^"]*)"(?: for (account\d+))?$/,
  async ({ world }: { world: UnifiedWorld }, code: string, aliasToken?: string) => {
    const alias = normalizeAlias(aliasToken, AccountContext.DEFAULT_ACCOUNT_ALIAS, 'account');
    setState(world, await world.api.accountClient.loginMfa(challengeToken(world, alias), code));
  },
);

When(/^the operator completes the second factor with an invalid challenge token$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.accountClient.loginMfa('not-a-real-mfa-token', totpCode(world.api.env.operator.totpSecret)));
});

When(
  /^the operator completes the second factor with the body '([^']*)'$/,
  async ({ world }: { world: UnifiedWorld }, body: string) => {
    setState(world, await world.api.accountClient.loginMfaRaw(parseJsonBody(body)));
  },
);

Then(/^the mfa response carries a token$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = accountData(world);
  expect(typeof data.token === 'string' && data.token.length > 0, `aștept un token în răspunsul mfa, am: ${JSON.stringify(data)}`).toBe(true);
});

When(
  /^the operator signs in with Google id token "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, idToken: string) => {
    setState(world, await world.api.accountClient.loginGoogle(idToken));
  },
);

When(
  /^the operator signs in with Google using the body '([^']*)'$/,
  async ({ world }: { world: UnifiedWorld }, body: string) => {
    setState(world, await world.api.accountClient.loginGoogleRaw(parseJsonBody(body)));
  },
);

When(/^the operator account is requested$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.accountClient.me());
});

When(/^the operator account is requested without authentication$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.accountClient.me(NO_AUTH));
});

Then(/^the account response carries the username and account id$/, async ({ world }: { world: UnifiedWorld }) => {
  const data = accountData(world);
  expect(typeof data.username === 'string' && typeof data.accountId === 'string', `aștept username și accountId, am: ${JSON.stringify(data)}`).toBe(true);
});

When(
  /^the operator updates the profile full name to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, fullName: string) => {
    setState(world, await world.api.accountClient.updateProfile({ fullName }));
  },
);

When(
  /^the operator updates the profile email to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, email: string) => {
    setState(world, await world.api.accountClient.updateProfile({ email }));
  },
);

When(
  /^the operator updates the profile phone to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, phone: string) => {
    setState(world, await world.api.accountClient.updateProfile({ phone }));
  },
);

When(/^the operator updates the profile to a fresh random full name$/, async ({ world }: { world: UnifiedWorld }) => {
  setState(world, await world.api.accountClient.updateProfile({ fullName: faker.person.fullName() }));
});

When(
  /^an unauthenticated client updates the profile email to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, email: string) => {
    setState(world, await world.api.accountClient.updateProfile({ email }, NO_AUTH));
  },
);

When(
  /^the operator changes the password from "([^"]*)" to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, current: string, next: string) => {
    setState(world, await world.api.accountClient.changePassword(current, next));
  },
);

When(
  /^an unauthenticated client changes the password from "([^"]*)" to "([^"]*)"$/,
  async ({ world }: { world: UnifiedWorld }, current: string, next: string) => {
    setState(world, await world.api.accountClient.changePassword(current, next, NO_AUTH));
  },
);

When(/^the operator rotates the password and restores it$/, async ({ world }: { world: UnifiedWorld }) => {
  const original = world.api.env.operator.password;
  const rotated = `${original}x9`;
  const first = await world.api.accountClient.changePassword(original, rotated);
  setState(world, first);
  if (first.statusCode === 200) {
    await world.api.accountClient.changePassword(rotated, original);
  }
  world.api.log.info({ statusCode: first.statusCode }, 'Rotație parolă (cu restaurare)');
});
