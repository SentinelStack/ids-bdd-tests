import { BaseClient } from '../BaseClient';
/** Autentificarea operatorului: parolă, al doilea factor (TOTP), Google, plus contul curent. */
export class AccountClient extends BaseClient {
  login(username: string, password: string) { return this.post('/api/auth/login', { username, password }); }
  loginMfa(mfaToken: string, code: string) { return this.post('/api/auth/mfa', { mfaToken, code }); }
  loginGoogle(idToken: string) { return this.post('/api/auth/google', { idToken }); }
  me() { return this.get('/api/account'); }
}
