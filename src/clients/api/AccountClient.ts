import { BaseClient } from '../BaseClient';
/** Autentificarea operatorului: parolă, al doilea factor (TOTP), Google, plus contul curent. */
export class AccountClient extends BaseClient {
  login(username: string, password: string) { return this.post('/api/auth/login', { username, password }); }
  loginMfa(mfaToken: string, code: string) { return this.post('/api/auth/mfa', { mfaToken, code }); }
  loginGoogle(idToken: string) { return this.post('/api/auth/google', { idToken }); }
  me() { return this.get('/api/account'); }
  /** Trimite corpul brut, ca să poată testa și cazurile cu câmpuri lipsă. */
  loginRaw(body: unknown) { return this.post('/api/auth/login', body); }
  loginMfaRaw(body: unknown) { return this.post('/api/auth/mfa', body); }
  loginGoogleRaw(body: unknown) { return this.post('/api/auth/google', body); }
  updateProfile(profile: Record<string, unknown>) { return this.put('/api/account/profile', profile); }
  changePassword(currentPassword: string, newPassword: string) {
    return this.post('/api/account/password', { currentPassword, newPassword });
  }
}
