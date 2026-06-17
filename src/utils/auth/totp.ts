import { authenticator } from 'otplib';
/** Generează codul TOTP curent dintr-un secret cunoscut (cont de test cu 2FA). */
export function totpCode(secret: string): string {
  return authenticator.generate(secret);
}
