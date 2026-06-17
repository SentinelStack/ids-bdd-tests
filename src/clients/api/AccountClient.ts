import { BaseClient, HeaderMap } from 'src/clients/BaseClient';

/** Autentificarea operatorului: parolă, al doilea factor (TOTP), Google, plus contul curent.
 *  Fiecare metodă acceptă un override opțional de headere, ca pașii negativi să forțeze 401. */
export class AccountClient extends BaseClient {
  login(username: string, password: string, headers?: HeaderMap) { return this.post('/api/auth/login', { username, password }, headers); }
  loginMfa(mfaToken: string, code: string, headers?: HeaderMap) { return this.post('/api/auth/mfa', { mfaToken, code }, headers); }
  loginGoogle(idToken: string, headers?: HeaderMap) { return this.post('/api/auth/google', { idToken }, headers); }
  me(headers?: HeaderMap) { return this.get('/api/account', headers); }
  /** Trimite corpul brut, ca să poată testa și cazurile cu câmpuri lipsă. */
  loginRaw(body: unknown, headers?: HeaderMap) { return this.post('/api/auth/login', body, headers); }
  loginMfaRaw(body: unknown, headers?: HeaderMap) { return this.post('/api/auth/mfa', body, headers); }
  loginGoogleRaw(body: unknown, headers?: HeaderMap) { return this.post('/api/auth/google', body, headers); }
  updateProfile(profile: Record<string, unknown>, headers?: HeaderMap) { return this.put('/api/account/profile', profile, headers); }
  changePassword(currentPassword: string, newPassword: string, headers?: HeaderMap) {
    return this.post('/api/account/password', { currentPassword, newPassword }, headers);
  }
}
