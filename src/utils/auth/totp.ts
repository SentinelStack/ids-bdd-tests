import { authenticator } from 'otplib';

export function totpCode(secret: string): string {
  return authenticator.generate(secret);
}
